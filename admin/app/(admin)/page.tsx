import { Users, CheckCircle2, ListChecks, MessageSquareText } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { db } from "@/lib/db/client";
import { marathonSteps, participants } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

async function getStats() {
  const [totalRow] = await db.select({ c: count() }).from(participants);
  const [doneRow] = await db.select({ c: count() }).from(participants).where(eq(participants.completed, true));
  const [stepsRow] = await db.select({ c: count() }).from(marathonSteps);
  return {
    total: totalRow?.c ?? 0,
    completed: doneRow?.c ?? 0,
    steps: stepsRow?.c ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const cards = [
    { label: "Участников", value: stats.total, icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Завершили", value: stats.completed, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
    { label: "Конверсия", value: `${completionRate}%`, icon: MessageSquareText, color: "from-fuchsia-500 to-pink-500" },
    { label: "Шагов", value: stats.steps, icon: ListChecks, color: "from-amber-500 to-orange-500" },
  ];
  return (
    <>
      <Topbar title="Дашборд" description="Обзор марафона в реальном времени" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <QuickActions />
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground px-1">Статистика</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((c) => (
              <Card key={c.label} className="hover-glow">
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </CardTitle>
                    <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${c.color} opacity-80`} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{c.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
