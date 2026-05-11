from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter

from app.db import users as users_repo

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class BroadcastResult:
    sent: int
    failed: int
    blocked: int


async def broadcast(bot: Bot, text: str, rate: float = 0.05) -> BroadcastResult:
    sent = failed = blocked = 0
    for user_id in await users_repo.all_user_ids():
        try:
            await bot.send_message(user_id, text)
            sent += 1
        except TelegramForbiddenError:
            blocked += 1
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
            try:
                await bot.send_message(user_id, text)
                sent += 1
            except Exception:
                failed += 1
        except Exception as e:
            logger.warning("broadcast failed for %s: %s", user_id, e)
            failed += 1
        await asyncio.sleep(rate)
    return BroadcastResult(sent=sent, failed=failed, blocked=blocked)
