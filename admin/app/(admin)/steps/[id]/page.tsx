import { notFound } from "next/navigation";

import { Topbar } from "@/components/layout/topbar";
import { StepForm } from "@/components/steps/step-form";
import { getStep } from "@/lib/db/queries/steps";

export const dynamic = "force-dynamic";

export default async function EditStepPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stepId = Number(id);
  if (Number.isNaN(stepId)) notFound();
  const step = await getStep(stepId);
  if (!step) notFound();
  return (
    <>
      <Topbar title={step.title} description="Редактирование шага марафона" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <StepForm
          id={step.id}
          initial={{
            title: step.title,
            text: step.text,
            task: step.task,
            button: step.button,
            attachmentFile: step.attachmentFile,
            attachmentCaption: step.attachmentCaption,
          }}
        />
      </div>
    </>
  );
}
