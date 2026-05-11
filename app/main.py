from __future__ import annotations

import asyncio
import logging

from aiogram import Bot
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web

from app.bot import build_bot, build_dispatcher
from app.config import settings
from app.db.engine import init_db
from app.handlers import register

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("marafon")


async def _run_polling() -> None:
    bot = build_bot()
    dp = build_dispatcher()
    register(dp)
    await init_db()
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Polling started")
    await dp.start_polling(bot)


async def _on_startup(bot: Bot) -> None:
    await init_db()
    target = f"{settings.webhook_url}{settings.webhook_path}"
    await bot.set_webhook(
        url=target,
        secret_token=settings.webhook_secret,
        drop_pending_updates=False,
        allowed_updates=["message", "callback_query"],
    )
    info = await bot.get_webhook_info()
    logger.info("Webhook registered: %s | pending=%s", target, info.pending_update_count)


async def _health(_: web.Request) -> web.Response:
    return web.Response(text="ok")


def _run_webhook() -> None:
    bot = build_bot()
    dp = build_dispatcher()
    register(dp)
    dp.startup.register(_on_startup)

    app = web.Application()
    app.router.add_get("/", _health)
    app.router.add_get("/health", _health)

    SimpleRequestHandler(dispatcher=dp, bot=bot, secret_token=settings.webhook_secret).register(
        app, path=settings.webhook_path
    )
    setup_application(app, dp, bot=bot)
    logger.info("Webhook server on :%s", settings.port)
    web.run_app(app, host="0.0.0.0", port=settings.port)


def main() -> None:
    if settings.is_webhook:
        _run_webhook()
    else:
        asyncio.run(_run_polling())


if __name__ == "__main__":
    main()
