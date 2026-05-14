"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createStep, deleteStep, reorder, updateStep } from "@/lib/db/queries/steps";

const stepSchema = z.object({
  title: z.string().min(1, "Заполни заголовок").max(200),
  text: z.string().min(1, "Заполни текст").max(4000),
  task: z.string().max(4000).default(""),
  button: z.string().min(1).max(50).default("Далее"),
  attachmentFile: z.string().max(200).default(""),
  attachmentCaption: z.string().max(500).default(""),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function parseStepForm(formData: FormData) {
  const parsed = stepSchema.safeParse({
    title: formData.get("title"),
    text: formData.get("text"),
    task: formData.get("task") ?? "",
    button: formData.get("button") ?? "Далее",
    attachmentFile: formData.get("attachmentFile") ?? "",
    attachmentCaption: formData.get("attachmentCaption") ?? "",
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.errors[0]?.message ?? "Ошибка валидации" };
  const d = parsed.data;
  return {
    ok: true as const,
    data: {
      title: d.title,
      text: d.text,
      task: d.task,
      button: d.button,
      attachmentFile: d.attachmentFile.trim() || null,
      attachmentCaption: d.attachmentCaption.trim() || null,
    },
  };
}

export async function createStepAction(formData: FormData) {
  await requireAuth();
  const result = parseStepForm(formData);
  if (!result.ok) return { ok: false, error: result.error };
  const step = await createStep(result.data);
  revalidatePath("/steps");
  redirect(`/steps/${step.id}`);
}

export async function updateStepAction(id: number, formData: FormData) {
  await requireAuth();
  const result = parseStepForm(formData);
  if (!result.ok) return { ok: false, error: result.error };
  await updateStep(id, result.data);
  revalidatePath("/steps");
  revalidatePath(`/steps/${id}`);
  return { ok: true };
}

export async function deleteStepAction(id: number) {
  await requireAuth();
  await deleteStep(id);
  revalidatePath("/steps");
}

export async function reorderStepsAction(ids: number[]) {
  await requireAuth();
  await reorder(ids);
  revalidatePath("/steps");
  return { ok: true };
}
