from __future__ import annotations

import asyncio
import json
import sys

from app.config import settings
from app.db.engine import close_db, connect, init_db


async def _seed_welcome(conn) -> int:
    with (settings.content_dir / "welcome.json").open(encoding="utf-8") as f:
        data = json.load(f)
    count = 0
    for key in ("greeting", "what_inside", "after_marathon", "cta"):
        value = data.get(key, "")
        await conn.execute(
            """
            INSERT INTO welcome_blocks (key, content) VALUES ($1, $2)
            ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
            """,
            key, value,
        )
        count += 1
    return count


async def _seed_steps(conn) -> int:
    with (settings.content_dir / "marathon.json").open(encoding="utf-8") as f:
        data = json.load(f)
    steps = data.get("steps", [])
    await conn.execute("DELETE FROM marathon_steps")
    for position, step in enumerate(steps):
        await conn.execute(
            """
            INSERT INTO marathon_steps (position, title, text, task, button, media)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            position,
            step["title"],
            step["text"],
            step.get("task", ""),
            step.get("button", "Далее"),
            step.get("media"),
        )
    return len(steps)


async def _seed_admin(conn, email: str, password: str, name: str) -> None:
    import hashlib

    salt = "marafon_static_salt"
    password_hash = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
    await conn.execute(
        """
        INSERT INTO admin_accounts (email, password_hash, name) VALUES ($1, $2, $3)
        ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
        """,
        email, password_hash, name,
    )


async def main() -> None:
    await init_db()
    async with connect() as conn:
        welcome_count = await _seed_welcome(conn)
        steps_count = await _seed_steps(conn)
        if len(sys.argv) >= 3:
            email, password = sys.argv[1], sys.argv[2]
            name = sys.argv[3] if len(sys.argv) > 3 else "Admin"
            await _seed_admin(conn, email, password, name)
            print(f"Admin created: {email}")
    print(f"Seeded: welcome={welcome_count} blocks, marathon={steps_count} steps")
    await close_db()


if __name__ == "__main__":
    asyncio.run(main())
