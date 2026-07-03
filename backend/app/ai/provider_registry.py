"""
Provider Registry — catalog of all supported AI providers.

Each provider is a dataclass describing:
  - name         : unique identifier  (e.g. "openai", "gemini")
  - display_name : human-readable label
  - capability   : "llm" | "stt" | "tts"
  - priority     : default order (lower = higher priority)
  - env_key      : env var name that holds the API key
  - call()       : adapter function that makes the actual HTTP request

Adding a new provider:
  1. Define a function `_call_<provider>(payload, api_key) -> str/bytes/dict`
  2. Register it with `register_provider(...)` at module bottom.
"""

import os
import time
import requests
import logging
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Any

logger = logging.getLogger("ai.registry")

# ── Payload types ─────────────────────────────────────────────────────────

@dataclass
class LLMPayload:
    system_prompt: str
    user_message:  str
    max_tokens:    int = 2048
    temperature:   float = 0.3


@dataclass
class STTPayload:
    audio_bytes: bytes
    filename:    str
    language:    str = "en"
    model:       str = "base"


@dataclass
class TTSPayload:
    text:  str
    voice: str = "alloy"


# ── Provider descriptor ───────────────────────────────────────────────────

@dataclass
class ProviderDescriptor:
    name:         str
    display_name: str
    capability:   str   # "llm" | "stt" | "tts"
    priority:     int
    env_key:      str
    call_fn:      Callable
    notes:        str = ""


# ── LLM adapters ─────────────────────────────────────────────────────────

def _call_openai_llm(payload: LLMPayload, api_key: str) -> str:
    res = requests.post(
        "https://api.openai.com/v1/chat/completions",
        json={
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": payload.system_prompt},
                {"role": "user",   "content": payload.user_message},
            ],
            "max_tokens":  payload.max_tokens,
            "temperature": payload.temperature,
        },
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        timeout=30,
    )
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"].strip()


def _call_gemini_llm(payload: LLMPayload, api_key: str) -> str:
    prompt = f"{payload.system_prompt}\n\n{payload.user_message}"
    res = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
        json={"contents": [{"parts": [{"text": prompt}]}]},
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    res.raise_for_status()
    return res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()


def _make_openrouter_llm(model: str) -> Callable:
    """Factory — returns an adapter for any OpenRouter model."""
    def _call(payload: LLMPayload, api_key: str) -> str:
        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": payload.system_prompt},
                    {"role": "user",   "content": payload.user_message},
                ],
                "max_tokens":  payload.max_tokens,
                "temperature": payload.temperature,
            },
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            timeout=30,
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"].strip()
    _call.__name__ = f"openrouter_{model.replace('/', '_')}"
    return _call


# ── STT adapters ──────────────────────────────────────────────────────────

def _call_local_whisper(payload: STTPayload, api_key: str) -> dict:
    from app.utils.audio import transcribe_local_audio
    return transcribe_local_audio(
        audio_bytes=payload.audio_bytes,
        filename=payload.filename,
        model=payload.model,
        language=payload.language,
    )


def _call_openai_stt(payload: STTPayload, api_key: str) -> dict:
    res = requests.post(
        "https://api.openai.com/v1/audio/transcriptions",
        headers={"Authorization": f"Bearer {api_key}"},
        files={"file": (payload.filename, payload.audio_bytes, "audio/wav")},
        data={"model": "whisper-1"},
        timeout=60,
    )
    res.raise_for_status()
    text = res.json().get("text", "")
    return {"text": text, "segments": [{"timestamp": "00:00", "text": text, "start": 0, "end": 0}]}


def _call_deepgram_stt(payload: STTPayload, api_key: str) -> dict:
    ext = payload.filename.rsplit(".", 1)[-1].lower() if "." in payload.filename else "wav"
    mime = {"wav": "audio/wav", "mp3": "audio/mpeg", "ogg": "audio/ogg",
            "webm": "audio/webm", "m4a": "audio/mp4"}.get(ext, "audio/wav")
    res = requests.post(
        "https://api.deepgram.com/v1/listen?smart_format=true&punctuate=true",
        headers={"Authorization": f"Token {api_key}", "Content-Type": mime},
        data=payload.audio_bytes,
        timeout=60,
    )
    res.raise_for_status()
    channels = res.json().get("results", {}).get("channels", [{}])
    text = channels[0].get("alternatives", [{}])[0].get("transcript", "")
    words = channels[0].get("alternatives", [{}])[0].get("words", [])
    segments = []
    if words:
        chunk, start = [], words[0].get("start", 0)
        for w in words:
            chunk.append(w.get("word", ""))
            if len(chunk) >= 10:
                end = w.get("end", start)
                segments.append({"timestamp": _fmt_time(start), "text": " ".join(chunk), "start": start, "end": end})
                chunk, start = [], end
        if chunk:
            segments.append({"timestamp": _fmt_time(start), "text": " ".join(chunk),
                             "start": start, "end": words[-1].get("end", start)})
    if not segments:
        segments = [{"timestamp": "00:00", "text": text, "start": 0, "end": 0}]
    return {"text": text, "segments": segments}


def _fmt_time(secs: float) -> str:
    m, s = divmod(int(secs), 60)
    return f"{m:02d}:{s:02d}"


# ── TTS adapters ──────────────────────────────────────────────────────────

def _call_elevenlabs_tts(payload: TTSPayload, api_key: str) -> bytes:
    # Map OpenAI voice names to ElevenLabs voice IDs
    voice_map = {
        "alloy":   "pNInz6obpgDQGcFmaJgB",  # Adam
        "echo":    "VR6AewLTigWG4xSOukaG",   # Arnold
        "fable":   "MF3mGyEYCl7XYWbV9V6O",   # Elli
        "onyx":    "yoZ06aMxZJJ28mfd3POQ",   # Sam
        "nova":    "21m00Tcm4TlvDq8ikWAM",   # Rachel
        "shimmer": "AZnzlk1XvdvUeBnXmlld",   # Domi
    }
    voice_id = voice_map.get(payload.voice, "pNInz6obpgDQGcFmaJgB")
    res = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json={"text": payload.text, "model_id": "eleven_multilingual_v2",
              "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}},
        headers={"xi-api-key": api_key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        timeout=60,
    )
    res.raise_for_status()
    return res.content


def _call_openai_tts(payload: TTSPayload, api_key: str) -> bytes:
    res = requests.post(
        "https://api.openai.com/v1/audio/speech",
        json={"model": "tts-1", "input": payload.text, "voice": payload.voice},
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        timeout=60,
    )
    res.raise_for_status()
    return res.content


# ── Registry ──────────────────────────────────────────────────────────────

_PROVIDERS: List[ProviderDescriptor] = []


def register_provider(p: ProviderDescriptor):
    _PROVIDERS.append(p)


def get_providers_by_capability(capability: str) -> List[ProviderDescriptor]:
    return sorted(
        [p for p in _PROVIDERS if p.capability == capability],
        key=lambda p: p.priority,
    )


def get_provider(name: str, capability: Optional[str] = None) -> Optional[ProviderDescriptor]:
    if not name:
        return None
    n = name.lower().strip()
    
    # Map common dropdown/legacy aliases
    if n == "openai":
        if capability == "stt":
            return _find_by_name("openai-stt")
        elif capability == "tts":
            return _find_by_name("openai-tts")
        else:
            return _find_by_name("openai")
            
    if n in ("gemini", "google gemini 2.0 flash", "google gemini"):
        return _find_by_name("gemini")
        
    if n in ("elevenlabs", "elevenlabs multilingual v2"):
        return _find_by_name("elevenlabs")
        
    if n in ("deepgram", "deepgram nova-2"):
        return _find_by_name("deepgram")
        
    if n in ("whisper", "local whisper", "local-whisper"):
        return _find_by_name("local-whisper")
        
    # Generic case-insensitive lookup
    for p in _PROVIDERS:
        if p.name.lower() == n or p.display_name.lower() == n:
            if capability is None or p.capability == capability:
                return p
    return None


def _find_by_name(name: str) -> Optional[ProviderDescriptor]:
    for p in _PROVIDERS:
        if p.name == name:
            return p
    return None



def list_all_providers() -> List[dict]:
    return [
        {"name": p.name, "display_name": p.display_name,
         "capability": p.capability, "priority": p.priority,
         "env_key": p.env_key, "notes": p.notes}
        for p in _PROVIDERS
    ]


# ── Register built-in providers ───────────────────────────────────────────

register_provider(ProviderDescriptor(
    name="openai", display_name="OpenAI GPT-4o-mini",
    capability="llm", priority=40, env_key="OPENAI_API_KEY",
    call_fn=_call_openai_llm,
    notes="Primary LLM. May hit quota limits on free tier.",
))

register_provider(ProviderDescriptor(
    name="gemini", display_name="Google Gemini 2.0 Flash",
    capability="llm", priority=20, env_key="GEMINI_API_KEY",
    call_fn=_call_gemini_llm,
    notes="Google native Gemini REST API.",
))

register_provider(ProviderDescriptor(
    name="openrouter-gemini", display_name="Gemini 2.5 Flash (OpenRouter)",
    capability="llm", priority=15, env_key="OPENROUTER_API_KEY",
    call_fn=_make_openrouter_llm("google/gemini-2.5-flash"),
    notes="Gemini via OpenRouter proxy. Reliable fallback.",
))

register_provider(ProviderDescriptor(
    name="openrouter-llama", display_name="Llama 3.1 8B (OpenRouter)",
    capability="llm", priority=30, env_key="OPENROUTER_API_KEY",
    call_fn=_make_openrouter_llm("meta-llama/llama-3.1-8b-instruct"),
    notes="Free Llama model via OpenRouter.",
))

register_provider(ProviderDescriptor(
    name="openrouter-mistral", display_name="Mistral 7B (OpenRouter)",
    capability="llm", priority=35, env_key="OPENROUTER_API_KEY",
    call_fn=_make_openrouter_llm("mistralai/mistral-7b-instruct:free"),
    notes="Free Mistral model via OpenRouter.",
))

# STT providers
register_provider(ProviderDescriptor(
    name="local-whisper", display_name="Local Whisper",
    capability="stt", priority=5, env_key="",
    call_fn=_call_local_whisper,
    notes="Runs entirely locally — no API key needed.",
))

register_provider(ProviderDescriptor(
    name="deepgram", display_name="Deepgram Nova-2",
    capability="stt", priority=10, env_key="DEEPGRAM_API_KEY",
    call_fn=_call_deepgram_stt,
    notes="High-accuracy cloud STT with word-level timestamps.",
))

register_provider(ProviderDescriptor(
    name="openai-stt", display_name="OpenAI Whisper API",
    capability="stt", priority=20, env_key="OPENAI_API_KEY",
    call_fn=_call_openai_stt,
    notes="OpenAI hosted Whisper endpoint.",
))

# TTS providers
register_provider(ProviderDescriptor(
    name="elevenlabs", display_name="ElevenLabs Multilingual v2",
    capability="tts", priority=5, env_key="ELEVENLABS_API_KEY",
    call_fn=_call_elevenlabs_tts,
    notes="High-quality multilingual TTS.",
))

register_provider(ProviderDescriptor(
    name="openai-tts", display_name="OpenAI TTS-1",
    capability="tts", priority=10, env_key="OPENAI_API_KEY",
    call_fn=_call_openai_tts,
    notes="OpenAI text-to-speech.",
))
