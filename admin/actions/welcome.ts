"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { WELCOME_KEYS, type WelcomeKey, upsertWelcomeBlock } from "@/lib/db/queries/welcome";

const schema = z.object({
  key: z.enum(WELCOME_KEYS),
  content: z.string().max(4000),
});

export async function saveWelcomeBlock(key: WelcomeKey, content: string) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = schema.safeParse({ key, content });
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  await upsertWelcomeBlock(parsed.data.key, parsed.data.content);
  revalidatePath("/welcome");
  return { ok: true };
}
