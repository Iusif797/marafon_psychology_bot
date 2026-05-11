from __future__ import annotations

from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

CB_INSIDE = "flow:inside"
CB_AFTER = "flow:after"
CB_BEGIN = "flow:begin"
CB_TASK = "flow:task"
CB_NEXT = "flow:next"
CB_DONE = "flow:done"


def _one(text: str, data: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text=text, callback_data=data)]])


def greeting_kb() -> InlineKeyboardMarkup:
    return _one("Я готов", CB_INSIDE)


def inside_kb() -> InlineKeyboardMarkup:
    return _one("Что я получу?", CB_AFTER)


def after_kb() -> InlineKeyboardMarkup:
    return _one("Начать марафон", CB_BEGIN)


def step_text_kb() -> InlineKeyboardMarkup:
    return _one("Получить задание", CB_TASK)


def task_kb(button_text: str, is_last: bool) -> InlineKeyboardMarkup:
    return _one(button_text or ("Завершить" if is_last else "Далее"), CB_DONE if is_last else CB_NEXT)
