import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { payments, paymentSettings, participants } from "@/lib/db/schema";

export async function getSettings() {
  const rows = await db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1);
  return rows[0] ?? null;
}

export async function paymentsList(limit = 100) {
  return db
    .select({
      id: payments.id,
      userId: payments.userId,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      paymentUrl: payments.paymentUrl,
      createdAt: payments.createdAt,
      completedAt: payments.completedAt,
      fullName: participants.fullName,
      username: participants.username,
    })
    .from(payments)
    .leftJoin(participants, eq(participants.id, payments.userId))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function paymentStats() {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      paid: sql<number>`count(*) filter (where status = 'paid')::int`,
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      revenue: sql<string>`coalesce(sum(amount) filter (where status = 'paid'), 0)::text`,
    })
    .from(payments);
  return {
    total: row?.total ?? 0,
    paid: row?.paid ?? 0,
    pending: row?.pending ?? 0,
    revenue: Number(row?.revenue ?? 0),
  };
}
