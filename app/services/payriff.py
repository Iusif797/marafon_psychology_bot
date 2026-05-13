from __future__ import annotations

import logging
from dataclasses import dataclass
from decimal import Decimal
from typing import Any

from aiohttp import ClientSession, ClientTimeout

from app.config import settings

logger = logging.getLogger("payriff")

_TIMEOUT = ClientTimeout(total=15)


@dataclass(frozen=True)
class CreatedOrder:
    order_id: str
    payment_url: str
    transaction_id: int | None


class PayriffError(Exception):
    pass


async def create_order(
    amount: Decimal,
    currency: str,
    description: str,
    callback_url: str,
    metadata: dict[str, Any] | None = None,
) -> CreatedOrder:
    body = {
        "amount": float(amount),
        "language": "RU",
        "currency": currency,
        "description": description,
        "callbackUrl": callback_url,
        "cardSave": False,
        "operation": "PURCHASE",
        "metadata": metadata or {},
    }
    payload = await _post("/api/v3/orders", body)
    data = payload.get("payload") or {}
    order_id = data.get("orderId")
    payment_url = data.get("paymentUrl")
    if not order_id or not payment_url:
        raise PayriffError(f"Unexpected create_order response: {payload}")
    return CreatedOrder(
        order_id=str(order_id),
        payment_url=str(payment_url),
        transaction_id=int(data["transactionId"]) if data.get("transactionId") else None,
    )


async def get_order_status(order_id: str) -> str:
    payload = await _get(f"/api/v3/orders/{order_id}")
    data = payload.get("payload") or {}
    return str(data.get("paymentStatus") or "").upper()


async def _post(path: str, body: dict[str, Any]) -> dict[str, Any]:
    async with ClientSession(timeout=_TIMEOUT) as session:
        async with session.post(
            f"{settings.payriff_api_base}{path}",
            json=body,
            headers={"Authorization": settings.payriff_secret_key, "Content-Type": "application/json"},
        ) as resp:
            return await _read(resp)


async def _get(path: str) -> dict[str, Any]:
    async with ClientSession(timeout=_TIMEOUT) as session:
        async with session.get(
            f"{settings.payriff_api_base}{path}",
            headers={"Authorization": settings.payriff_secret_key},
        ) as resp:
            return await _read(resp)


async def _read(resp: Any) -> dict[str, Any]:
    text = await resp.text()
    if resp.status >= 400:
        logger.error("Payriff HTTP %s: %s", resp.status, text)
        raise PayriffError(f"HTTP {resp.status}: {text[:200]}")
    try:
        return await resp.json(content_type=None)
    except Exception as exc:
        raise PayriffError(f"Invalid JSON: {text[:200]}") from exc
