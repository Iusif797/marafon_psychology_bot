import { Topbar } from "@/components/layout/topbar";

export default function ParticipantsPage() {
  return (
    <>
      <Topbar title="Участники" description="Раздел готовится в следующей итерации" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Скоро здесь появятся статистика, список участников и графики.
        </div>
      </div>
    </>
  );
}
