"""
Circuit Breaker for AI providers.

States:
  CLOSED   → healthy, requests pass through
  OPEN     → too many failures, skip for cooldown period
  HALF_OPEN → cooldown expired, probe with one request

Usage:
    cb = get_circuit_breaker("openai")
    if cb.is_available():
        try:
            result = call_openai(...)
            cb.record_success()
        except Exception as e:
            cb.record_failure()
"""

import threading
import datetime
import logging
from typing import Dict, Optional

logger = logging.getLogger("ai.circuit_breaker")

FAILURE_THRESHOLD = 5        # failures before opening circuit
COOLDOWN_SECONDS  = 600      # 10 minutes cooldown when open
HALF_OPEN_TIMEOUT = 30       # seconds for half-open probe window


class CircuitBreakerState:
    CLOSED    = "closed"
    OPEN      = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    def __init__(self, provider_name: str):
        self.provider_name   = provider_name
        self.state           = CircuitBreakerState.CLOSED
        self.failure_count   = 0
        self.last_failure_at: Optional[datetime.datetime] = None
        self.opened_at:       Optional[datetime.datetime] = None
        self._lock           = threading.Lock()

    # ── public API ─────────────────────────────────────────────────────────

    def is_available(self) -> bool:
        """Return True if the provider should be tried."""
        with self._lock:
            if self.state == CircuitBreakerState.CLOSED:
                return True

            if self.state == CircuitBreakerState.OPEN:
                if self._cooldown_elapsed():
                    self._transition_to_half_open()
                    return True          # allow one probe request
                return False

            # HALF_OPEN — allow one probe
            return True

    def record_success(self):
        """Reset the breaker after a successful call."""
        with self._lock:
            if self.state != CircuitBreakerState.CLOSED:
                logger.info(f"[CB] {self.provider_name}: circuit CLOSED after success")
            self.failure_count = 0
            self.last_failure_at = None
            self.opened_at = None
            self.state = CircuitBreakerState.CLOSED

    def record_failure(self, error: str = ""):
        """Increment failure counter; open circuit if threshold reached."""
        with self._lock:
            self.failure_count  += 1
            self.last_failure_at = datetime.datetime.utcnow()

            if self.state == CircuitBreakerState.HALF_OPEN:
                # probe failed → reopen
                self._open_circuit()
                return

            if self.failure_count >= FAILURE_THRESHOLD:
                self._open_circuit()
                logger.warning(
                    f"[CB] {self.provider_name}: circuit OPENED after "
                    f"{self.failure_count} failures. Cooldown {COOLDOWN_SECONDS}s. "
                    f"Error: {error}"
                )

    def reset(self):
        """Manually reset circuit breaker (admin action)."""
        with self._lock:
            self.failure_count   = 0
            self.last_failure_at = None
            self.opened_at       = None
            self.state           = CircuitBreakerState.CLOSED
            logger.info(f"[CB] {self.provider_name}: manually reset")

    def get_status(self) -> dict:
        with self._lock:
            remaining = 0
            if self.state == CircuitBreakerState.OPEN and self.opened_at:
                elapsed = (datetime.datetime.utcnow() - self.opened_at).total_seconds()
                remaining = max(0, int(COOLDOWN_SECONDS - elapsed))
            return {
                "provider":        self.provider_name,
                "state":           self.state,
                "failure_count":   self.failure_count,
                "opened_at":       self.opened_at.isoformat() if self.opened_at else None,
                "cooldown_remaining_seconds": remaining,
            }

    # ── private helpers ────────────────────────────────────────────────────

    def _open_circuit(self):
        self.state     = CircuitBreakerState.OPEN
        self.opened_at = datetime.datetime.utcnow()

    def _transition_to_half_open(self):
        self.state = CircuitBreakerState.HALF_OPEN
        logger.info(f"[CB] {self.provider_name}: circuit HALF_OPEN, probing...")

    def _cooldown_elapsed(self) -> bool:
        if not self.opened_at:
            return True
        elapsed = (datetime.datetime.utcnow() - self.opened_at).total_seconds()
        return elapsed >= COOLDOWN_SECONDS


# ── Global registry ───────────────────────────────────────────────────────

_breakers: Dict[str, CircuitBreaker] = {}
_registry_lock = threading.Lock()


def get_circuit_breaker(provider_name: str) -> CircuitBreaker:
    """Get (or create) the CircuitBreaker for a given provider."""
    with _registry_lock:
        if provider_name not in _breakers:
            _breakers[provider_name] = CircuitBreaker(provider_name)
        return _breakers[provider_name]


def get_all_breaker_statuses() -> list:
    """Return status dicts for all tracked circuit breakers."""
    with _registry_lock:
        return [cb.get_status() for cb in _breakers.values()]


def reset_circuit_breaker(provider_name: str):
    """Admin-triggered manual reset."""
    cb = get_circuit_breaker(provider_name)
    cb.reset()
