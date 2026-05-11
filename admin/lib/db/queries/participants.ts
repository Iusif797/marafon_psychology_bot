import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { marathonSteps, participants, type Participant } from "@/lib/db/schema";

export type ParticipantsFilters = {
  search?: string;
  step?: number | "all";
  status?: "all" | "active" | "completed";
};

export async function listParticipants(filters: ParticipantsFilters = {}): Promise<Participant[]> {
  const conditions = [];
  if (filters.search) {
    const q = `%${filters.search.replace(/[%_]/g, "")}%`;
    conditions.push(or(ilike(participants.fullName, q), ilike(participants.username, q)));
  }
  if (typeof filters.step === "number") conditions.push(eq(participants.currentStep, filters.step));
  if (filters.status === "active") conditions.push(eq(participants.completed, false));
  if (filters.status === "completed") conditions.push(eq(participants.completed, true));
  const where = conditions.length ? and(...conditions) : undefined;
  return db.select().from(participants).where(where).orderBy(desc(participants.startedAt)).limit(500);
}

export async function participantStats() {
  const [row] = await db
    .select({
      total: sql<number>`COUNT(*)::int`,
      completed: sql<number>`COUNT(*) FILTER (WHERE ${participants.completed} = TRUE)::int`,
      active: sql<number>`COUNT(*) FILTER (WHERE ${participants.completed} = FALSE)::int`,
      today: sql<number>`COUNT(*) FILTER (WHERE ${participants.startedAt} >= NOW() - INTERVAL '24 hours')::int`,
    })
    .from(participants);
  return {
    total: row?.total ?? 0,
    completed: row?.completed ?? 0,
    active: row?.active ?? 0,
    today: row?.today ?? 0,
  };
}

export async function participantsByStep(): Promise<{ position: number; title: string; count: number }[]> {
  const rows = await db
    .select({
      position: marathonSteps.position,
      title: marathonSteps.title,
      count: sql<number>`COUNT(${participants.id})::int`,
    })
    .from(marathonSteps)
    .leftJoin(participants, eq(participants.currentStep, marathonSteps.position))
    .groupBy(marathonSteps.position, marathonSteps.title)
    .orderBy(marathonSteps.position);
  return rows.map((r) => ({ position: r.position, title: r.title, count: r.count ?? 0 }));
}
