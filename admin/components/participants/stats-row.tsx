import { Users, CheckCircle2, Activity, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

type Stats = { total: number; completed: number; active: number; today: number };

export function StatsRow({ stats }: { stats: Stats }) {
  const conversion = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const cards = [
    { label: "Всего", value: stats.total, icon: Users, accent: "from-blue-500/30 to-cyan-500/10" },
    { label: "Активные", value: stats.active, icon: Activity, accent: "from-violet-500/30 to-fuchsia-500/10" },
    { label: "Завершили", value: `${stats.completed} · ${conversion}%`, icon: CheckCircle2, accent: "from-emerald-500/30 to-teal-500/10" },
    { label: "За 24 часа", value: stats.today, icon: Sparkles, accent: "from-amber-500/30 to-orange-500/10" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className={`bg-gradient-to-br ${c.accent} p-4 sm:p-5 hover-glow`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{c.value}</div>
          </Card>
        );
      })}
    </div>
  );
}
