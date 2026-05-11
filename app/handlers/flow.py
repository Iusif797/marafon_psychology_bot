from __future__ import annotations

from aiogram import F, Router
from aiogram.types import CallbackQuery, Message

from app.keyboards.flow import CB_DONE, CB_NEXT, CB_TASK, step_text_kb, task_kb
from app.services.content import Step, get_step, total_steps
from app.services.progress import advance, current_index

router = Router(name="flow")


async def send_step(message: Message, step: Step) -> None:
    body = f"<b>{step.title}</b>\n\n{step.text}"
    if step.task:
        await message.answer(body, reply_markup=step_text_kb())
        return
    is_last = step.index == (await total_steps()) - 1
    await message.answer(body, reply_markup=task_kb(step.button, is_last))


@router.callback_query(F.data == CB_TASK)
async def on_task(cb: CallbackQuery) -> None:
    if not cb.from_user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    step = await get_step(await current_index(cb.from_user.id))
    if not step:
        await cb.answer()
        return
    is_last = step.index == (await total_steps()) - 1
    await cb.message.answer(step.task, reply_markup=task_kb(step.button, is_last))
    await cb.answer()


@router.callback_query(F.data == CB_NEXT)
async def on_next(cb: CallbackQuery) -> None:
    if not cb.from_user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    next_index, _ = await advance(cb.from_user.id)
    step = await get_step(next_index)
    if step:
        await send_step(cb.message, step)
    await cb.answer()


@router.callback_query(F.data == CB_DONE)
async def on_done(cb: CallbackQuery) -> None:
    if not cb.from_user or not isinstance(cb.message, Message):
        await cb.answer()
        return
    await advance(cb.from_user.id)
    await cb.message.answer(
        "Ты прошёл марафон до конца.\n\nЭто только начало.\nТы знаешь, что делать дальше.\n\n— Теона"
    )
    await cb.answer("Готово")
