import { neon } from "@neondatabase/serverless";

const DDL = `
ALTER TABLE participants ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
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
    amount NUMERIC(12, 2) NOT NULL DEFAULT 29,
    currency TEXT NOT NULL DEFAULT 'USD',
    paywall_text TEXT NOT NULL DEFAULT '',
    pay_button_text TEXT NOT NULL DEFAULT 'Оплатить и начать',
    success_text TEXT NOT NULL DEFAULT 'Оплата прошла. Поехали!',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT singleton_payment_settings CHECK (id = 1)
);
`;

const SEED = `Готов изменить своё состояние, мышление и жизнь?\n\nТогда нажимай на ссылку ниже для оплаты и присоединяйся к 60-дневному марафону трансформации.`;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(url);

const statements = DDL.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
for (const stmt of statements) {
  await sql(stmt);
  console.log("OK:", stmt.split("\n")[0].slice(0, 70));
}

await sql(`INSERT INTO payment_settings (id, paywall_text) VALUES (1, $1) ON CONFLICT (id) DO NOTHING`, [SEED]);
console.log("Seed payment_settings: OK");
