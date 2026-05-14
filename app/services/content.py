from __future__ import annotations

import time
from dataclasses import dataclass

from app.config import settings
from app.db.engine import connect


@dataclass(frozen=True)
class Step:
    index: int
    title: str
    text: str
    task: str
    button: str
    media: str | None = None
    attachment_file: str | None = None
    attachment_caption: str | None = None


@dataclass(frozen=True)
class Welcome:
    greeting: str
    what_inside: str
    after_marathon: str
    cta: str


_cache: dict[str, tuple[float, object]] = {}


def _is_fresh(key: str) -> bool:
    entry = _cache.get(key)
    return entry is not None and (time.time() - entry[0]) < settings.content_cache_ttl


async def load_welcome() -> Welcome:
    if _is_fresh("welcome"):
        return _cache["welcome"][1]  # type: ignore[return-value]
    async with connect() as conn:
        rows = await conn.fetch("SELECT key, content FROM welcome_blocks")
    data = {r["key"]: r["content"] for r in rows}
    welcome = Welcome(
        greeting=data.get("greeting", ""),
        what_inside=data.get("what_inside", ""),
        after_marathon=data.get("after_marathon", ""),
        cta=data.get("cta", ""),
    )
    _cache["welcome"] = (time.time(), welcome)
    return welcome


async def load_steps() -> list[Step]:
    if _is_fresh("steps"):
        return _cache["steps"][1]  # type: ignore[return-value]
    async with connect() as conn:
        rows = await conn.fetch(
            """
            SELECT position, title, text, task, button, media,
                   attachment_file, attachment_caption
            FROM marathon_steps ORDER BY position
            """
        )
    steps = [
        Step(
            index=i,
            title=r["title"],
            text=r["text"],
            task=r["task"] or "",
            button=r["button"] or "Далее",
            media=r["media"],
            attachment_file=r["attachment_file"],
            attachment_caption=r["attachment_caption"],
        )
        for i, r in enumerate(rows)
    ]
    _cache["steps"] = (time.time(), steps)
    return steps


async def total_steps() -> int:
    return len(await load_steps())


async def get_step(index: int) -> Step | None:
    steps = await load_steps()
    if 0 <= index < len(steps):
        return steps[index]
    return None


def invalidate_cache() -> None:
    _cache.clear()
