from __future__ import annotations

import logging

from app.config import settings
from app.db import payments as repo
from app.services import payriff

logger = logging.getLogger("payments")


async def is_paid(user_id: int) -> bool:
    if user_id in settings.admin_ids:
        return True
    settings_row = await repo.get_settings()
    if not settings_row.enabled:
        return True
    return await repo.is_user_paid(user_id)


async def start_payment(user_id: int, full_name: str) -> repo.Payment | None:
    config = await repo.get_settings()
    if not config.enabled:
        return None
    if not settings.payments_enabled:
        logger.warning("Payment requested but PAYRIFF_SECRET_KEY is empty")
        return None
    callback_url = _callback_url()
    if not callback_url:
        logger.error("Cannot create Payriff order: public base URL is empty")
        return None
    description = f"Marathon access · {full_name}"[:100]
    order = await payriff.create_order(
        amount=config.amount,
        currency=config.currency,
        description=description,
        callback_url=callback_url,
        metadata={"user_id": str(user_id)},
    )
    await repo.create_payment(
        order_id=order.order_id,
        user_id=user_id,
        amount=config.amount,
        currency=config.currency,
        payment_url=order.payment_url,
        transaction_id=order.transaction_id,
    )
    return repo.Payment(
        id=order.order_id,
        user_id=user_id,
        amount=config.amount,
        currency=config.currency,
        status="pending",
        payment_url=order.payment_url,
    )


async def verify_and_complete(order_id: str) -> int | None:
    try:
        status = await payriff.get_order_status(order_id)
    except payriff.PayriffError as exc:
        logger.warning("Failed to fetch order %s: %s", order_id, exc)
        return None
    if status == "PAID":
        return await repo.mark_paid(order_id)
    if status in {"DECLINED", "CANCELED", "CANCELLED", "FAILED"}:
        await repo.set_status(order_id, status.lower())
    return None


def _callback_url() -> str:
    base = settings.public_base_url.rstrip("/")
    if not base:
        return ""
    return f"{base}/payments/callback"
