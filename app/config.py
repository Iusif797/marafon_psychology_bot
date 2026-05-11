from __future__ import annotations

import hashlib
import os
import re
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parent.parent

_TELEGRAM_SECRET_RE = re.compile(r"[^A-Za-z0-9_-]")


def _parse_admins(raw: str) -> tuple[int, ...]:
    if not raw:
        return ()
    return tuple(int(x.strip()) for x in raw.split(",") if x.strip().isdigit())


def _sanitize_secret(raw: str) -> str:
    cleaned = _TELEGRAM_SECRET_RE.sub("", raw or "")
    if len(cleaned) >= 16:
        return cleaned[:256]
    return hashlib.sha256((raw or "marafon").encode()).hexdigest()


def _resolve_webhook_url() -> str:
    explicit = os.getenv("WEBHOOK_URL", "").strip().rstrip("/")
    if explicit:
        return explicit
    render = os.getenv("RENDER_EXTERNAL_URL", "").strip().rstrip("/")
    if render:
        return render
    return ""


@dataclass(frozen=True)
class Settings:
    bot_token: str = field(default_factory=lambda: os.environ["BOT_TOKEN"])
    admin_ids: tuple[int, ...] = field(default_factory=lambda: _parse_admins(os.getenv("ADMIN_IDS", "")))
    database_url: str = field(default_factory=lambda: os.environ["DATABASE_URL"])
    content_dir: Path = field(default_factory=lambda: ROOT_DIR / "content")
    mode: str = field(default_factory=lambda: os.getenv("MODE", "polling").lower())
    webhook_url: str = field(default_factory=_resolve_webhook_url)
    webhook_secret: str = field(default_factory=lambda: _sanitize_secret(os.getenv("WEBHOOK_SECRET", "")))
    port: int = field(default_factory=lambda: int(os.getenv("PORT", "10000")))
    timezone: str = field(default_factory=lambda: os.getenv("TIMEZONE", "Europe/Moscow"))
    content_cache_ttl: int = field(default_factory=lambda: int(os.getenv("CONTENT_CACHE_TTL", "30")))

    @property
    def webhook_path(self) -> str:
        return f"/webhook/{self.webhook_secret}"

    @property
    def is_webhook(self) -> bool:
        return self.mode == "webhook" and bool(self.webhook_url)


settings = Settings()
