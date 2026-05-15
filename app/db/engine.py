from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

import asyncpg

from app.config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS welcome_blocks (
    key TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marathon_steps (
    id SERIAL PRIMARY KEY,
    position INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    task TEXT NOT NULL DEFAULT '',
    button TEXT NOT NULL DEFAULT 'Далее',
    media TEXT,
    attachment_file TEXT,
    attachment_caption TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE marathon_steps ADD COLUMN IF NOT EXISTS attachment_file TEXT;
ALTER TABLE marathon_steps ADD COLUMN IF NOT EXISTS attachment_caption TEXT;

CREATE TABLE IF NOT EXISTS participants (
    id BIGINT PRIMARY KEY,
    username TEXT,
    full_name TEXT NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_reminder_at TIMESTAMPTZ,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    paid_at TIMESTAMPTZ
);

ALTER TABLE participants ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_participants_step ON participants(current_step);
CREATE INDEX IF NOT EXISTS idx_participants_completed ON participants(completed);
CREATE INDEX IF NOT EXISTS idx_participants_paid ON participants(paid);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'payriff',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_url TEXT,
    transaction_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE TABLE IF NOT EXISTS payment_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 60,
    currency TEXT NOT NULL DEFAULT 'USD',
    paywall_text TEXT NOT NULL DEFAULT '',
    pay_button_text TEXT NOT NULL DEFAULT 'Оплатить и начать',
    success_text TEXT NOT NULL DEFAULT 'Оплата прошла. Поехали!',
    welcome_file TEXT,
    welcome_caption TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT singleton_payment_settings CHECK (id = 1)
);

ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS welcome_file TEXT;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS welcome_caption TEXT;

INSERT INTO payment_settings (id, paywall_text, welcome_file, welcome_caption)
VALUES (
    1,
    'Готов изменить своё состояние, мышление и жизнь?\n\nТогда нажимай на ссылку ниже для оплаты и присоединяйся к 60-дневному марафону трансформации.',
    'emotional_state_map.pdf',
    'Тест «Карта эмоционального состояния» — начни с него.'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS admin_accounts (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS broadcasts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'all',
    sent INTEGER NOT NULL DEFAULT 0,
    failed INTEGER NOT NULL DEFAULT 0,
    blocked INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_status ON broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_broadcasts_scheduled ON broadcasts(scheduled_at) WHERE status = 'scheduled';
"""

_pool: asyncpg.Pool | None = None


async def init_db() -> None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(SCHEMA)


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=5)
    return _pool


@asynccontextmanager
async def connect() -> AsyncIterator[asyncpg.Connection]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        yield conn


async def close_db() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
