import { Topbar } from "@/components/layout/topbar";
import { StepForm } from "@/components/steps/step-form";

export default function NewStepPage() {
  return (
    <>
      <Topbar title="Новый шаг" description="Добавление шага в конец марафона" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <StepForm />
      </div>
    </>
  );
}
