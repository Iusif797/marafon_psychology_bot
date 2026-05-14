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
  welcomeFile: z.string().max(200).optional().default(""),
  welcomeCaption: z.string().max(500).optional().default(""),
});

export async function savePaymentSettings(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const data = parsed.data;
  const welcomeFile = data.welcomeFile.trim() || null;
  const welcomeCaption = data.welcomeCaption.trim() || null;
  await db
    .insert(paymentSettings)
    .values({
      id: 1,
      enabled: data.enabled,
      amount: String(data.amount),
      currency: data.currency,
      paywallText: data.paywallText,
      payButtonText: data.payButtonText,
      successText: data.successText,
      welcomeFile,
      welcomeCaption,
    })
    .onConflictDoUpdate({
      target: paymentSettings.id,
      set: {
        enabled: data.enabled,
        amount: String(data.amount),
        currency: data.currency,
        paywallText: data.paywallText,
        payButtonText: data.payButtonText,
        successText: data.successText,
        welcomeFile,
        welcomeCaption,
        updatedAt: new Date(),
      },
    });
  revalidatePath("/payments");
  return { ok: true };
}
