from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parent.parent


def _parse_admins(raw: str) -> tuple[int, ...]:
    if not raw:
        return ()
    return tuple(int(x.strip()) for x in raw.split(",") if x.strip().isdigit())


@dataclass(frozen=True)
class Settings:
    bot_token: str = field(default_factory=lambda: os.environ["BOT_TOKEN"])
    admin_ids: tuple[int, ...] = field(default_factory=lambda: _parse_admins(os.getenv("ADMIN_IDS", "")))
    database_url: str = field(default_factory=lambda: os.environ["DATABASE_URL"])
    content_dir: Path = field(default_factory=lambda: ROOT_DIR / "content")
    mode: str = field(default_factory=lambda: os.getenv("MODE", "polling").lower())
    webhook_url: str = field(default_factory=lambda: os.getenv("WEBHOOK_URL", "").rstrip("/"))
    webhook_secret: str = field(default_factory=lambda: os.getenv("WEBHOOK_SECRET", ""))
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
