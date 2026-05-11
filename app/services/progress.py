from __future__ import annotations

from app.db import users as users_repo
from app.services.content import total_steps


async def current_index(user_id: int) -> int:
    user = await users_repo.get_user(user_id)
    return user.current_step if user else 0


async def advance(user_id: int) -> tuple[int, bool]:
    user = await users_repo.get_user(user_id)
    current = user.current_step if user else 0
    next_index = current + 1
    last = (await total_steps()) - 1
    if next_index > last:
        await users_repo.set_step(user_id, last)
        await users_repo.mark_completed(user_id)
        return last, True
    await users_repo.set_step(user_id, next_index)
    return next_index, next_index == last


async def is_completed(user_id: int) -> bool:
    user = await users_repo.get_user(user_id)
    return bool(user and user.completed)
