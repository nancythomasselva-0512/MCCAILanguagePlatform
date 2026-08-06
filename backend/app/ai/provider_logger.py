"""
Provider Logger — structured logging for every AI provider call.

Logs to:
  1. Python logger (console / file)
  2. ProviderLog database table (for admin panel display)
"""

import time
import datetime
import logging
from typing import Optional
from sqlalchemy.orm import Session

logger = logging.getLogger("ai.provider")


class ProviderCallLog:
    """Transient holder for one call's metadata, built up over the call lifecycle."""

    def __init__(self, feature: str, tenant_id: Optional[str] = None):
        self.feature        = feature
        self.tenant_id      = tenant_id
        self.provider       = ""
        self.status         = "pending"     # "success" | "failed" | "skipped"
        self.error_code     = None
        self.error_message  = ""
        self.retry_count    = 0
        self.fallback_occurred = False
        self._start_time    = time.monotonic()
        self.response_time_ms = 0

    def mark_success(self, provider: str, retry_count: int = 0, fallback: bool = False):
        self.provider          = provider
        self.status            = "success"
        self.retry_count       = retry_count
        self.fallback_occurred = fallback
        self.response_time_ms  = int((time.monotonic() - self._start_time) * 1000)
        logger.info(
            f"[AI] ✅ {provider} | {self.feature} | "
            f"{self.response_time_ms}ms | retry={retry_count} | fallback={fallback}"
        )

    def mark_failure(self, provider: str, error_code: Optional[int],
                     error_message: str, retry_count: int = 0):
        self.provider         = provider
        self.status           = "failed"
        self.error_code       = error_code
        self.error_message    = error_message
        self.retry_count      = retry_count
        self.response_time_ms = int((time.monotonic() - self._start_time) * 1000)
        logger.warning(
            f"[AI] ❌ {provider} | {self.feature} | "
            f"code={error_code} | {error_message[:120]} | retry={retry_count}"
        )

    def mark_skipped(self, provider: str, reason: str):
        logger.debug(f"[AI] ⏭  {provider} | {self.feature} | skipped: {reason}")


def persist_log(call_log: ProviderCallLog, db: Optional[Session]):
    """Write the final call log to the DB ProviderLog table."""
    if db is None:
        return
    try:
        from app.models.models import ProviderLog  # late import to avoid circular
        entry = ProviderLog(
            provider_name      = call_log.provider or "unknown",
            feature            = call_log.feature,
            status             = call_log.status,
            error_code         = str(call_log.error_code) if call_log.error_code else None,
            error_message      = call_log.error_message[:500] if call_log.error_message else None,
            response_time_ms   = call_log.response_time_ms,
            retry_count        = call_log.retry_count,
            fallback_occurred  = call_log.fallback_occurred,
            tenant_id          = call_log.tenant_id,
        )
        db.add(entry)
        db.commit()
    except Exception as e:
        logger.debug(f"[AI] Could not persist provider log: {e}")
