from __future__ import annotations

import logging
from pathlib import Path

from aiogram import Bot
from aiogram.types import FSInputFile, Message

logger = logging.getLogger("files")

FILES_ROOT = Path(__file__).resolve().parent.parent.parent / "content" / "files"

_file_id_cache: dict[str, str] = {}


def _resolve(name: str) -> Path | None:
    candidate = (FILES_ROOT / name).resolve()
    if FILES_ROOT not in candidate.parents and candidate != FILES_ROOT:
        return None
    if not candidate.is_file():
        return None
    return candidate


async def send_attachment(
    bot: Bot,
    chat_id: int,
    name: str | None,
    caption: str | None = None,
) -> Message | None:
    if not name:
        return None
    cached = _file_id_cache.get(name)
    if cached:
        try:
            return await bot.send_document(chat_id, cached, caption=caption or None)
        except Exception as exc:
            logger.warning("Cached file_id failed for %s: %s. Re-uploading.", name, exc)
            _file_id_cache.pop(name, None)
    path = _resolve(name)
    if not path:
        logger.error("Attachment not found: %s", name)
        return None
    message = await bot.send_document(chat_id, FSInputFile(path), caption=caption or None)
    if message.document and message.document.file_id:
        _file_id_cache[name] = message.document.file_id
    return message
