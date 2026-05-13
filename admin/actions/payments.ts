"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { paymentSettings } from "@/lib/db/schema";

const schema = z.object({
  enabled: z.boolean(),
  amount: z.coerce.number().min(0).max(100000),
  currency: z.string().min(3).max(8),
  paywallText: z.string().max(4000),
  payButtonText: z.string().max(64),
  successText: z.string().max(500),
});

export async function savePaymentSettings(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { enabled, amount, currency, paywallText, payButtonText, successText } = parsed.data;
  await db
    .insert(paymentSettings)
    .values({
      id: 1,
      enabled,
      amount: String(amount),
      currency,
      paywallText,
      payButtonText,
      successText,
    })
    .onConflictDoUpdate({
      target: paymentSettings.id,
      set: {
        enabled,
        amount: String(amount),
        currency,
        paywallText,
        payButtonText,
        successText,
        updatedAt: new Date(),
      },
    });
  revalidatePath("/payments");
  return { ok: true };
}
