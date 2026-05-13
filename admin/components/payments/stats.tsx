import { CreditCard, Hourglass, TrendingUp, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  stats: { total: number; paid: number; pending: number; revenue: number };
  currency: string;
};

export function PaymentsStats({ stats, currency }: Props) {
  const conversion = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0;
  const cards = [
    { label: "Выручка", value: formatMoney(stats.revenue, currency), sub: "успешных оплат", icon: Wallet, accent: "from-emerald-500/20 to-teal-500/5", iconBg: "from-emerald-500 to-teal-500" },
    { label: "Оплатили", value: stats.paid, sub: `${conversion}% конверсия`, icon: TrendingUp, accent: "from-violet-500/20 to-fuchsia-500/5", iconBg: "from-violet-500 to-fuchsia-500" },
    { label: "Ожидают", value: stats.pending, sub: "не завершили", icon: Hourglass, accent: "from-amber-500/20 to-orange-500/5", iconBg: "from-amber-500 to-orange-500" },
    { label: "Всего счетов", value: stats.total, sub: "создано", icon: CreditCard, accent: "from-blue-500/20 to-cyan-500/5", iconBg: "from-blue-500 to-cyan-500" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className="relative overflow-hidden p-4 sm:p-5 hover-glow animate-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">{c.label}</span>
                <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${c.iconBg} shadow-md ring-1 ring-white/10`}>
                  <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">{c.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{c.sub}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function formatMoney(amount: number, currency: string): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;
}
