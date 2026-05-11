import { Users, CheckCircle2, ListChecks, TrendingUp } from "lucide-react";
import { count, eq } from "drizzle-orm";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { db } from "@/lib/db/client";
import { marathonSteps, participants } from "@/lib/db/schema";

export const revalidate = 30;

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
    { label: "Участников", value: stats.total, icon: Users, accent: "from-blue-500/20 to-cyan-500/5", iconBg: "from-blue-500 to-cyan-500" },
    { label: "Завершили", value: stats.completed, icon: CheckCircle2, accent: "from-emerald-500/20 to-teal-500/5", iconBg: "from-emerald-500 to-teal-500" },
    { label: "Конверсия", value: `${completionRate}%`, icon: TrendingUp, accent: "from-fuchsia-500/20 to-pink-500/5", iconBg: "from-fuchsia-500 to-pink-500" },
    { label: "Шагов в марафоне", value: stats.steps, icon: ListChecks, accent: "from-amber-500/20 to-orange-500/5", iconBg: "from-amber-500 to-orange-500" },
  ];
  return (
    <>
      <Topbar title="Дашборд" description="Обзор марафона в реальном времени" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <QuickActions />
        <section className="space-y-3 animate-in" style={{ animationDelay: "240ms" }}>
          <div className="flex items-baseline justify-between px-1">
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Статистика</h2>
            <span className="text-[10px] text-muted-foreground/70 tabular-nums">обновляется каждые 30 сек</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Card
                  key={c.label}
                  className="relative overflow-hidden p-4 sm:p-5 hover-glow animate-in"
                  style={{ animationDelay: `${280 + i * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
                        {c.label}
                      </span>
                      <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${c.iconBg} shadow-md ring-1 ring-white/10`}>
                        <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">{c.value}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
