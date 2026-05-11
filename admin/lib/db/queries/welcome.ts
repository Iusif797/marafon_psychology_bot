import { db } from "@/lib/db/client";
import { welcomeBlocks } from "@/lib/db/schema";

const KEYS = ["greeting", "what_inside", "after_marathon", "cta"] as const;
export type WelcomeKey = (typeof KEYS)[number];

export async function getWelcome(): Promise<Record<WelcomeKey, string>> {
  const rows = await db.select().from(welcomeBlocks);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.content;
  return {
    greeting: map.greeting ?? "",
    what_inside: map.what_inside ?? "",
    after_marathon: map.after_marathon ?? "",
    cta: map.cta ?? "",
  };
}

export async function upsertWelcomeBlock(key: WelcomeKey, content: string) {
  await db
    .insert(welcomeBlocks)
    .values({ key, content })
    .onConflictDoUpdate({ target: welcomeBlocks.key, set: { content, updatedAt: new Date() } });
}

export const WELCOME_LABELS: Record<WelcomeKey, { title: string; hint: string }> = {
  greeting: { title: "Приветствие", hint: "Первое сообщение после /start. Энергия и крючок." },
  what_inside: { title: "Что внутри марафона", hint: "Объясни, как устроены шаги и что ждёт участника." },
  after_marathon: { title: "Что получишь после", hint: "Описание результата. Эмоциональное состояние." },
  cta: { title: "CTA (запасное)", hint: "Резервный текст. Сейчас не используется." },
};

export { KEYS as WELCOME_KEYS };
