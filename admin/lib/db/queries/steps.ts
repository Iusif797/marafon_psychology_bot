import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { marathonSteps, type MarathonStep } from "@/lib/db/schema";

export async function listSteps(): Promise<MarathonStep[]> {
  return db.select().from(marathonSteps).orderBy(asc(marathonSteps.position));
}

export async function getStep(id: number): Promise<MarathonStep | null> {
  const [row] = await db.select().from(marathonSteps).where(eq(marathonSteps.id, id)).limit(1);
  return row ?? null;
}

export type StepInput = {
  title: string;
  text: string;
  task: string;
  button: string;
};

export async function createStep(input: StepInput): Promise<MarathonStep> {
  const [maxRow] = await db.select({ max: sql<number>`COALESCE(MAX(${marathonSteps.position}), -1)` }).from(marathonSteps);
  const nextPosition = (maxRow?.max ?? -1) + 1;
  const [row] = await db
    .insert(marathonSteps)
    .values({ position: nextPosition, ...input })
    .returning();
  return row;
}

export async function updateStep(id: number, input: StepInput): Promise<void> {
  await db.update(marathonSteps).set({ ...input, updatedAt: new Date() }).where(eq(marathonSteps.id, id));
}

export async function deleteStep(id: number): Promise<void> {
  await db.delete(marathonSteps).where(eq(marathonSteps.id, id));
  const remaining = await db.select().from(marathonSteps).orderBy(asc(marathonSteps.position));
  await reorder(remaining.map((s) => s.id));
}

export async function reorder(ids: number[]): Promise<void> {
  await db.transaction(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx
        .update(marathonSteps)
        .set({ position: -1000 - i })
        .where(eq(marathonSteps.id, ids[i]));
    }
    for (let i = 0; i < ids.length; i++) {
      await tx.update(marathonSteps).set({ position: i }).where(eq(marathonSteps.id, ids[i]));
    }
  });
}
