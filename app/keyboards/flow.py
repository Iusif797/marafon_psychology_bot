from __future__ import annotations

from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

CB_INSIDE = "flow:inside"
CB_AFTER = "flow:after"
CB_BEGIN = "flow:begin"
CB_TASK = "flow:task"
CB_NEXT = "flow:next"
CB_DONE = "flow:done"
CB_PAY = "pay:start"
CB_CHECK = "pay:check"


def _one(text: str, data: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text=text, callback_data=data)]])


def greeting_kb() -> InlineKeyboardMarkup:
    return _one("Я готов", CB_INSIDE)


def inside_kb() -> InlineKeyboardMarkup:
    return _one("Что я получу?", CB_AFTER)


def after_kb() -> InlineKeyboardMarkup:
    return _one("Начать марафон", CB_BEGIN)


def paywall_kb(button_text: str) -> InlineKeyboardMarkup:
    return _one(button_text or "Оплатить и начать", CB_PAY)


def payment_link_kb(payment_url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Перейти к оплате", url=payment_url)],
            [InlineKeyboardButton(text="Я оплатил", callback_data=CB_CHECK)],
        ]
    )


def check_payment_kb() -> InlineKeyboardMarkup:
    return _one("Я оплатил, проверить", CB_CHECK)


def step_text_kb() -> InlineKeyboardMarkup:
    return _one("Получить задание", CB_TASK)


def task_kb(button_text: str, is_last: bool) -> InlineKeyboardMarkup:
    return _one(button_text or ("Завершить" if is_last else "Далее"), CB_DONE if is_last else CB_NEXT)
