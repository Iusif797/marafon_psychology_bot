from __future__ import annotations

import logging

from aiogram import Bot
from aiohttp import web

from app.config import settings
from app.db import payments as repo
from app.services import payments as service

logger = logging.getLogger("web.payments")


def register(app: web.Application, bot: Bot) -> None:
    async def handler(request: web.Request) -> web.Response:
        order_id = request.query.get("orderId") or request.query.get("orderID")
        if not order_id:
            return web.Response(status=400, text="orderId required")
        user_id = await service.verify_and_complete(order_id)
        if user_id is None:
            return _redirect_to_bot(request, status="pending")
        await _notify_user(bot, user_id)
        return _redirect_to_bot(request, status="ok")

    app.router.add_get("/payments/callback", handler)
    app.router.add_post("/payments/callback", handler)


async def _notify_user(bot: Bot, user_id: int) -> None:
    try:
        config = await repo.get_settings()
        await bot.send_message(user_id, config.success_text)
        await bot.send_message(user_id, "Открой бот — первый шаг марафона ждёт.")
    except Exception as exc:
        logger.warning("Failed to notify %s after payment: %s", user_id, exc)


def _redirect_to_bot(request: web.Request, *, status: str) -> web.Response:
    target = _bot_link()
    if not target:
        return web.Response(text=f"Status: {status}. Return to the bot.")
    return web.HTTPFound(location=target)


def _bot_link() -> str:
    if settings.bot_username:
        return f"https://t.me/{settings.bot_username}"
    return ""
