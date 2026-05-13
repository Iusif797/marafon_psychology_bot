from __future__ import annotations

from aiogram import Dispatcher

from app.handlers import admin, flow, payment, start


def register(dp: Dispatcher) -> None:
    dp.include_router(start.router)
    dp.include_router(payment.router)
    dp.include_router(flow.router)
    dp.include_router(admin.router)
