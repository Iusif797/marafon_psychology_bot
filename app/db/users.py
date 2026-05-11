from __future__ import annotations

from dataclasses import dataclass

from app.db.engine import connect


@dataclass(frozen=True)
class UserRow:
    id: int
    username: str | None
    full_name: str
    current_step: int
    completed: bool


async def upsert_user(user_id: int, username: str | None, full_name: str) -> UserRow | None:
    async with connect() as conn:
        await conn.execute(
            """
            INSERT INTO participants (id, username, full_name)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE SET
                username = EXCLUDED.username,
                full_name = EXCLUDED.full_name,
                updated_at = NOW()
            """,
            user_id, username, full_name,
        )
        return await _fetch(conn, user_id)


async def set_step(user_id: int, step: int) -> None:
    async with connect() as conn:
        await conn.execute(
            "UPDATE participants SET current_step = $1, updated_at = NOW() WHERE id = $2",
            step, user_id,
        )


async def mark_completed(user_id: int) -> None:
    async with connect() as conn:
        await conn.execute(
            "UPDATE participants SET completed = TRUE, updated_at = NOW() WHERE id = $1",
            user_id,
        )


async def get_user(user_id: int) -> UserRow | None:
    async with connect() as conn:
        return await _fetch(conn, user_id)


async def all_user_ids() -> list[int]:
    async with connect() as conn:
        rows = await conn.fetch("SELECT id FROM participants")
    return [int(r["id"]) for r in rows]


async def stats() -> dict[str, int]:
    async with connect() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM participants")
        done = await conn.fetchval("SELECT COUNT(*) FROM participants WHERE completed = TRUE")
    return {"total": int(total or 0), "completed": int(done or 0)}


async def step_distribution() -> list[tuple[int, int]]:
    async with connect() as conn:
        rows = await conn.fetch(
            "SELECT current_step, COUNT(*) AS c FROM participants GROUP BY current_step ORDER BY current_step"
        )
    return [(int(r["current_step"]), int(r["c"])) for r in rows]


async def _fetch(conn, user_id: int) -> UserRow | None:
    row = await conn.fetchrow(
        "SELECT id, username, full_name, current_step, completed FROM participants WHERE id = $1",
        user_id,
    )
    if not row:
        return None
    return UserRow(
        id=int(row["id"]),
        username=row["username"],
        full_name=row["full_name"],
        current_step=int(row["current_step"]),
        completed=bool(row["completed"]),
    )
