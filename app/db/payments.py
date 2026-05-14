from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any

from app.db.engine import connect


@dataclass(frozen=True)
class PaymentSettings:
    enabled: bool
    amount: Decimal
    currency: str
    paywall_text: str
    pay_button_text: str
    success_text: str
    welcome_file: str | None
    welcome_caption: str | None


@dataclass(frozen=True)
class Payment:
    id: str
    user_id: int
    amount: Decimal
    currency: str
    status: str
    payment_url: str | None


async def get_settings() -> PaymentSettings:
    async with connect() as conn:
        row = await conn.fetchrow(
            """
            SELECT enabled, amount, currency, paywall_text, pay_button_text,
                   success_text, welcome_file, welcome_caption
            FROM payment_settings WHERE id = 1
            """
        )
    return PaymentSettings(
        enabled=bool(row["enabled"]) if row else True,
        amount=Decimal(row["amount"]) if row else Decimal("29"),
        currency=str(row["currency"]) if row else "USD",
        paywall_text=str(row["paywall_text"]) if row else "",
        pay_button_text=str(row["pay_button_text"]) if row else "Оплатить и начать",
        success_text=str(row["success_text"]) if row else "Оплата прошла. Поехали!",
        welcome_file=row["welcome_file"] if row else None,
        welcome_caption=row["welcome_caption"] if row else None,
    )


async def create_payment(order_id: str, user_id: int, amount: Decimal, currency: str, payment_url: str, transaction_id: int | None) -> None:
    async with connect() as conn:
        await conn.execute(
            """
            INSERT INTO payments (id, user_id, amount, currency, status, payment_url, transaction_id)
            VALUES ($1, $2, $3, $4, 'pending', $5, $6)
            ON CONFLICT (id) DO NOTHING
            """,
            order_id, user_id, amount, currency, payment_url, transaction_id,
        )


async def mark_paid(order_id: str) -> int | None:
    async with connect() as conn:
        row = await conn.fetchrow(
            """
            UPDATE payments SET status = 'paid', completed_at = NOW()
            WHERE id = $1 AND status <> 'paid'
            RETURNING user_id
            """,
            order_id,
        )
        if not row:
            return None
        user_id = int(row["user_id"])
        await conn.execute(
            "UPDATE participants SET paid = TRUE, paid_at = NOW(), updated_at = NOW() WHERE id = $1",
            user_id,
        )
        return user_id


async def set_status(order_id: str, status: str) -> None:
    async with connect() as conn:
        await conn.execute(
            "UPDATE payments SET status = $1 WHERE id = $2 AND status NOT IN ('paid')",
            status, order_id,
        )


async def latest_pending(user_id: int) -> Payment | None:
    async with connect() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, user_id, amount, currency, status, payment_url FROM payments
            WHERE user_id = $1 AND status = 'pending'
            ORDER BY created_at DESC LIMIT 1
            """,
            user_id,
        )
    return _row(row)


async def is_user_paid(user_id: int) -> bool:
    async with connect() as conn:
        val = await conn.fetchval("SELECT paid FROM participants WHERE id = $1", user_id)
    return bool(val)


async def grant_access(user_id: int) -> None:
    async with connect() as conn:
        await conn.execute(
            "UPDATE participants SET paid = TRUE, paid_at = NOW(), updated_at = NOW() WHERE id = $1",
            user_id,
        )


def _row(row: Any) -> Payment | None:
    if not row:
        return None
    return Payment(
        id=str(row["id"]),
        user_id=int(row["user_id"]),
        amount=Decimal(row["amount"]),
        currency=str(row["currency"]),
        status=str(row["status"]),
        payment_url=row["payment_url"],
    )
