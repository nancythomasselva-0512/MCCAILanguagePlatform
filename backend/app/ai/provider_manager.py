"""
Central AI Provider Manager.

Public API
----------
from app.ai.provider_manager import provider_manager

# LLM (translation, summarisation, etc.)
text = provider_manager.call_llm(
    system_prompt="You are a translator...",
    user_message="Hello",
    feature="translation",
    db=db, tenant=tenant
)

# STT (transcription)
result = provider_manager.call_stt(
    audio_bytes=b"...", filename="audio.wav",
    language="en", model="base",
    feature="Audio To Text",
    db=db, tenant=tenant
)

# TTS (text-to-speech)
audio_bytes = provider_manager.call_tts(
    text="Hello world", voice="alloy",
    db=db, tenant=tenant
)

Internal flow
-------------
1. Build ordered provider list from:
   a. DB FeatureProviderMapping (admin-configured)
   b. Default registry order if no DB mapping exists
2. Resolve API key for each provider (tenant config → global config → .env)
3. Skip providers whose circuit breaker is OPEN
4. For each candidate:
   - Try up to MAX_RETRIES times with exponential backoff
   - On success → record success, persist log, return result
   - On failure → record failure in circuit breaker, try next provider
5. If all fail → raise HTTP 503
"""

import time
import logging
import os
from typing import Optional, List
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ai.circuit_breaker import get_circuit_breaker
from app.ai.provider_logger import ProviderCallLog, persist_log
from app.ai.provider_registry import (
    ProviderDescriptor,
    LLMPayload, STTPayload, TTSPayload,
    get_providers_by_capability, get_provider,
)
from app.core.config import settings

logger = logging.getLogger("ai.manager")

MAX_RETRIES      = 2      # retries per provider (total attempts = MAX_RETRIES + 1)
BACKOFF_BASE_SEC = 0.5    # 0.5s → 1s → 2s …
RETRY_ERRORS     = {429, 500, 502, 503, 504}  # HTTP codes that trigger a retry


# ── Key resolution ────────────────────────────────────────────────────────

def _resolve_key(provider_name: str, db: Optional[Session], tenant) -> str:
    """Resolve API key: tenant DB → global DB → env var."""
    from app.models.models import ProviderConfiguration
    from app.core.security import decrypt_data

    if db and tenant:
        tc = db.query(ProviderConfiguration).filter(
            ProviderConfiguration.tenant_id   == tenant.id,
            ProviderConfiguration.provider_name == provider_name,
            ProviderConfiguration.is_enabled  == True,
        ).first()
        if tc and tc.credentials_encrypted:
            return decrypt_data(tc.credentials_encrypted)

    if db:
        gc = db.query(ProviderConfiguration).filter(
            ProviderConfiguration.tenant_id   == None,
            ProviderConfiguration.provider_name == provider_name,
            ProviderConfiguration.is_enabled  == True,
        ).first()
        if gc and gc.credentials_encrypted:
            return decrypt_data(gc.credentials_encrypted)

    # Fall back to env var using the registry's env_key
    desc = get_provider(provider_name)
    env_key = desc.env_key if desc else None

    # Also check common aliases
    ALIASES = {
        "openai":            "OPENAI_API_KEY",
        "openai-stt":        "OPENAI_API_KEY",
        "openai-tts":        "OPENAI_API_KEY",
        "gemini":            "GEMINI_API_KEY",
        "openrouter-gemini": "OPENROUTER_API_KEY",
        "openrouter-llama":  "OPENROUTER_API_KEY",
        "openrouter-mistral":"OPENROUTER_API_KEY",
        "deepgram":          "DEEPGRAM_API_KEY",
        "elevenlabs":        "ELEVENLABS_API_KEY",
    }
    env_key = ALIASES.get(provider_name, env_key)
    if env_key:
        val = getattr(settings, env_key, None) or os.environ.get(env_key, "")
        if val:
            return val
    return ""


# ── Ordered provider list ─────────────────────────────────────────────────

def _get_ordered_providers(
    capability: str,
    feature: str,
    db: Optional[Session],
    tenant,
) -> List[ProviderDescriptor]:
    """
    Return providers in priority order.
    DB FeatureProviderMapping takes precedence; registry defaults fill gaps.
    """
    registry_providers = get_providers_by_capability(capability)

    if db is None:
        return registry_providers

    try:
        from app.models.models import FeatureProviderMapping
        db_mappings = (
            db.query(FeatureProviderMapping)
            .filter(
                FeatureProviderMapping.feature_name == feature,
                FeatureProviderMapping.is_enabled   == True,
            )
            .order_by(FeatureProviderMapping.priority.asc())
            .all()
        )
        if db_mappings:
            ordered = []
            seen = set()
            for m in db_mappings:
                desc = get_provider(m.provider_name, capability=capability)
                if desc and desc.name not in seen:
                    ordered.append(desc)
                    seen.add(desc.name)
            # append remaining registry providers not in DB mapping
            for p in registry_providers:
                if p.name not in seen:
                    ordered.append(p)
            return ordered
    except Exception as e:
        logger.debug(f"[AI] Could not read DB feature mappings: {e}")

    return registry_providers


# ── Core retry logic ──────────────────────────────────────────────────────

def _try_provider(desc: ProviderDescriptor, payload, call_log: ProviderCallLog,
                  db, tenant) -> Optional[object]:
    """
    Attempt to call a provider with exponential backoff retries.
    Returns result on success, None on final failure.
    """
    cb  = get_circuit_breaker(desc.name)
    key = "" if not desc.env_key else _resolve_key(desc.name, db, tenant)

    # Skip local-whisper key check (no key required)
    if desc.name != "local-whisper" and not key:
        call_log.mark_skipped(desc.name, "no API key configured")
        return None

    if not cb.is_available():
        call_log.mark_skipped(desc.name, f"circuit breaker OPEN")
        return None

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            result = desc.call_fn(payload, key)
            cb.record_success()
            return result
        except Exception as exc:
            last_error     = exc
            status_code    = None
            err_text       = str(exc)

            # Extract HTTP status from requests.HTTPError
            if hasattr(exc, "response") and exc.response is not None:
                status_code = exc.response.status_code
                try:
                    err_text = exc.response.json().get("error", {}).get("message", err_text)
                except Exception:
                    err_text = exc.response.text[:200]

            call_log.retry_count = attempt
            call_log.mark_failure(desc.name, status_code, err_text, attempt)

            should_retry = (
                status_code in RETRY_ERRORS or status_code is None
            ) and attempt < MAX_RETRIES

            if should_retry:
                wait = BACKOFF_BASE_SEC * (2 ** attempt)
                logger.info(f"[AI] Retry {attempt+1}/{MAX_RETRIES} for {desc.name} in {wait}s")
                time.sleep(wait)
            else:
                break

    cb.record_failure(str(last_error))
    return None


# ── Public manager ────────────────────────────────────────────────────────

class AIProviderManager:

    def call_llm(
        self,
        system_prompt: str,
        user_message:  str,
        feature:       str = "llm",
        db:            Optional[Session] = None,
        tenant        = None,
        max_tokens:    int   = 2048,
        temperature:   float = 0.3,
    ) -> str:
        payload    = LLMPayload(system_prompt, user_message, max_tokens, temperature)
        call_log   = ProviderCallLog(feature, tenant.id if tenant else None)
        providers  = _get_ordered_providers("llm", feature, db, tenant)
        first      = True

        for desc in providers:
            result = _try_provider(desc, payload, call_log, db, tenant)
            if result is not None:
                call_log.mark_success(desc.name, call_log.retry_count, fallback=not first)
                persist_log(call_log, db)
                return result
            first = False

        persist_log(call_log, db)
        raise HTTPException(
            status_code=503,
            detail="All AI language providers are currently unavailable. Please try again later.",
        )

    def call_stt(
        self,
        audio_bytes: bytes,
        filename:    str,
        language:    str = "en",
        model:       str = "base",
        feature:     str = "Audio To Text",
        db:          Optional[Session] = None,
        tenant       = None,
    ) -> dict:
        payload   = STTPayload(audio_bytes, filename, language, model)
        call_log  = ProviderCallLog(feature, tenant.id if tenant else None)
        providers = _get_ordered_providers("stt", feature, db, tenant)
        first     = True

        for desc in providers:
            result = _try_provider(desc, payload, call_log, db, tenant)
            if result is not None:
                call_log.mark_success(desc.name, call_log.retry_count, fallback=not first)
                persist_log(call_log, db)
                return result
            first = False

        persist_log(call_log, db)
        raise HTTPException(
            status_code=503,
            detail="All speech-to-text providers are currently unavailable. Please try again later.",
        )

    def call_tts(
        self,
        text:    str,
        voice:   str = "alloy",
        feature: str = "Text To Speech",
        db:      Optional[Session] = None,
        tenant   = None,
    ) -> bytes:
        payload   = TTSPayload(text, voice)
        call_log  = ProviderCallLog(feature, tenant.id if tenant else None)
        providers = _get_ordered_providers("tts", feature, db, tenant)
        first     = True

        for desc in providers:
            result = _try_provider(desc, payload, call_log, db, tenant)
            if result is not None:
                call_log.mark_success(desc.name, call_log.retry_count, fallback=not first)
                persist_log(call_log, db)
                return result
            first = False

        persist_log(call_log, db)
        raise HTTPException(
            status_code=503,
            detail="All text-to-speech providers are currently unavailable. Please try again later.",
        )

    def test_provider(self, provider_name: str, db=None, tenant=None) -> dict:
        """Live connectivity test — used by admin panel 'Test' button."""
        import time
        desc = get_provider(provider_name)
        if not desc:
            return {"success": False, "error": f"Provider '{provider_name}' not found in registry"}

        key  = _resolve_key(provider_name, db, tenant)
        if not key and desc.env_key:
            return {"success": False, "error": "No API key configured for this provider"}

        start = time.monotonic()
        try:
            if desc.capability == "llm":
                result = desc.call_fn(
                    LLMPayload("You are a test bot.", "Reply with exactly: ok", max_tokens=5),
                    key,
                )
                ok = isinstance(result, str) and len(result) > 0
            elif desc.capability == "stt":
                # we just verify the key format, not a real audio test
                ok = bool(key)
                result = "Key present — full audio test requires audio file"
            elif desc.capability == "tts":
                audio = desc.call_fn(TTSPayload("Test.", "alloy"), key)
                ok = isinstance(audio, bytes) and len(audio) > 0
                result = f"{len(audio)} bytes received"
            else:
                ok, result = False, "Unknown capability"

            elapsed = int((time.monotonic() - start) * 1000)
            if ok:
                get_circuit_breaker(provider_name).record_success()
            return {"success": ok, "response_time_ms": elapsed, "detail": str(result)[:200]}
        except Exception as e:
            elapsed = int((time.monotonic() - start) * 1000)
            get_circuit_breaker(provider_name).record_failure(str(e))
            return {"success": False, "response_time_ms": elapsed, "error": str(e)[:300]}


# Singleton instance
provider_manager = AIProviderManager()
