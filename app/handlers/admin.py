from __future__ import annotations

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message

from app.config import settings
from app.db import users as users_repo
from app.services.broadcast import broadcast
from app.services.content import invalidate_cache, load_steps, load_welcome

router = Router(name="admin")


class BroadcastFlow(StatesGroup):
    waiting_text = State()


def _is_admin(user_id: int | None) -> bool:
    return user_id is not None and user_id in settings.admin_ids


@router.message(Command("admin"))
async def show_admin(message: Message) -> None:
    if not _is_admin(message.from_user.id if message.from_user else None):
        return
    await message.answer(
        "<b>Админ-панель</b>\n\n"
        "/stats — статистика участников\n"
        "/broadcast — массовая рассылка\n"
        "/reload — сбросить кеш контента"
    )


@router.message(Command("stats"))
async def show_stats(message: Message) -> None:
    if not _is_admin(message.from_user.id if message.from_user else None):
        return
    s = await users_repo.stats()
    dist = await users_repo.step_distribution()
    lines = [f"Всего: <b>{s['total']}</b>", f"Завершили: <b>{s['completed']}</b>", "", "По шагам:"]
    lines += [f"  шаг {step + 1}: {count}" for step, count in dist]
    await message.answer("\n".join(lines))


@router.message(Command("broadcast"))
async def start_broadcast(message: Message, state: FSMContext) -> None:
    if not _is_admin(message.from_user.id if message.from_user else None):
        return
    await state.set_state(BroadcastFlow.waiting_text)
    await message.answer("Пришли текст рассылки. /cancel — отмена.")


@router.message(Command("cancel"))
async def cancel(message: Message, state: FSMContext) -> None:
    if await state.get_state():
        await state.clear()
        await message.answer("Отменено.")


@router.message(BroadcastFlow.waiting_text, F.text)
async def do_broadcast(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer("Рассылка запущена…")
    result = await broadcast(message.bot, message.html_text)
    await message.answer(
        f"Готово.\nОтправлено: <b>{result.sent}</b>\n"
        f"Заблокировали: <b>{result.blocked}</b>\nОшибок: <b>{result.failed}</b>"
    )


@router.message(Command("reload"))
async def reload_content(message: Message) -> None:
    if not _is_admin(message.from_user.id if message.from_user else None):
        return
    invalidate_cache()
    welcome = await load_welcome()
    steps = await load_steps()
    await message.answer(
        f"Кеш сброшен.\nШагов: <b>{len(steps)}</b>\nПриветствие: {len(welcome.greeting)} символов."
    )
