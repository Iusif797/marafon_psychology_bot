from __future__ import annotations

import logging

from aiogram import F, Router
from aiogram.types import CallbackQuery, Message

from app.db import payments as repo
from app.handlers.flow import send_step
from app.keyboards.flow import CB_CHECK, CB_PAY, check_payment_kb, payment_link_kb
from app.services import payments as service
from app.services.content import get_step
from app.services.progress import current_index

logger = logging.getLogger("handler.payment")

router = Router(name="payment")


@router.callback_query(F.data == CB_PAY)
async def start_payment(cb: CallbackQuery) -> None:
    user = cb.from_user
    if not user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    await cb.answer("Создаю счёт…")
    try:
        payment = await service.start_payment(user.id, user.full_name)
    except Exception as exc:
        logger.exception("Failed to start payment for %s: %s", user.id, exc)
        await cb.message.answer("Платёж не удалось создать. Напиши администратору.")
        return
    if not payment or not payment.payment_url:
        await cb.message.answer("Оплата временно недоступна. Напиши администратору.")
        return
    pretty_amount = _format_amount(payment.amount, payment.currency)
    text = (
        f"Сумма: <b>{pretty_amount}</b>\n\n"
        "Нажми «Перейти к оплате», заверши покупку, затем вернись сюда и нажми «Я оплатил»."
    )
    await cb.message.answer(text, reply_markup=payment_link_kb(payment.payment_url))


@router.callback_query(F.data == CB_CHECK)
async def check_payment(cb: CallbackQuery) -> None:
    user = cb.from_user
    if not user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    await cb.answer("Проверяю оплату…")
    if await service.is_paid(user.id):
        await _grant_marathon(cb.message, user.id)
        return
    pending = await repo.latest_pending(user.id)
    if not pending:
        await cb.message.answer("Активного счёта не нашёл. Нажми кнопку оплаты заново.")
        return
    user_id = await service.verify_and_complete(pending.id)
    if user_id:
        await _grant_marathon(cb.message, user_id)
        return
    await cb.message.answer(
        "Оплата ещё не подтверждена. Подожди минуту и нажми «Я оплатил, проверить» ещё раз.",
        reply_markup=check_payment_kb(),
    )


async def _grant_marathon(message: Message, user_id: int) -> None:
    config = await repo.get_settings()
    await message.answer(config.success_text)
    index = await current_index(user_id)
    step = await get_step(index)
    if step:
        await send_step(message, step)


def _format_amount(amount, currency: str) -> str:
    value = f"{amount:.2f}".rstrip("0").rstrip(".")
    return f"{value} {currency}"
