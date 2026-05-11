from __future__ import annotations

from aiogram import F, Router
from aiogram.filters import CommandStart
from aiogram.types import CallbackQuery, Message

from app.db import users as users_repo
from app.keyboards.flow import CB_AFTER, CB_BEGIN, CB_INSIDE, after_kb, greeting_kb, inside_kb
from app.services.content import get_step, load_welcome
from app.services.progress import current_index

router = Router(name="start")


@router.message(CommandStart())
async def on_start(message: Message) -> None:
    user = message.from_user
    if not user:
        return
    await users_repo.upsert_user(user.id, user.username, user.full_name)
    welcome = await load_welcome()
    await message.answer(welcome.greeting, reply_markup=greeting_kb())


@router.callback_query(F.data == CB_INSIDE)
async def show_inside(cb: CallbackQuery) -> None:
    welcome = await load_welcome()
    if isinstance(cb.message, Message):
        await cb.message.answer(welcome.what_inside, reply_markup=inside_kb())
    await cb.answer()


@router.callback_query(F.data == CB_AFTER)
async def show_after(cb: CallbackQuery) -> None:
    welcome = await load_welcome()
    if isinstance(cb.message, Message):
        await cb.message.answer(welcome.after_marathon, reply_markup=after_kb())
    await cb.answer()


@router.callback_query(F.data == CB_BEGIN)
async def begin_marathon(cb: CallbackQuery) -> None:
    if not cb.from_user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    index = await current_index(cb.from_user.id)
    step = await get_step(index)
    if not step:
        await cb.answer()
        return
    from app.handlers.flow import send_step

    await send_step(cb.message, step)
    await cb.answer()
