import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";
import { StepsList } from "@/components/steps/steps-list";
import { listSteps } from "@/lib/db/queries/steps";

export const dynamic = "force-dynamic";

export default async function StepsPage() {
  const steps = await listSteps();
  return (
    <>
      <Topbar title="Шаги марафона" description="Порядок шагов меняется перетаскиванием" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/steps/new">
              <Plus className="h-4 w-4" />
              Добавить шаг
            </Link>
          </Button>
        </div>
        <StepsList initial={steps} />
      </div>
    </>
  );
}
