import { neon } from "@neondatabase/serverless";

const DDL = `
ALTER TABLE marathon_steps ADD COLUMN IF NOT EXISTS attachment_file TEXT;
ALTER TABLE marathon_steps ADD COLUMN IF NOT EXISTS attachment_caption TEXT;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS welcome_file TEXT;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS welcome_caption TEXT;
`;

const WELCOME_FILE = "emotional_state_map.pdf";
const WELCOME_CAPTION = "Тест «Карта эмоционального состояния» — начни с него.";

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

const result = await sql(
  `UPDATE payment_settings
   SET welcome_file = COALESCE(welcome_file, $1),
       welcome_caption = COALESCE(welcome_caption, $2),
       updated_at = NOW()
   WHERE id = 1
   RETURNING welcome_file, welcome_caption`,
  [WELCOME_FILE, WELCOME_CAPTION]
);
console.log("payment_settings.welcome_*:", result[0]);
