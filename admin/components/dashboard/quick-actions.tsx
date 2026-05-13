import Link from "next/link";
import { ArrowUpRight, MessageSquareText, ListChecks, Send, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";

const actions = [
  {
    href: "/welcome",
    title: "Приветствие",
    description: "Тексты, которые видит участник до начала марафона",
    icon: MessageSquareText,
    accent: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    iconBg: "from-violet-500 to-fuchsia-500",
  },
  {
    href: "/steps",
    title: "Шаги марафона",
    description: "Содержание каждого шага, порядок, задания",
    icon: ListChecks,
    accent: "from-amber-500/25 via-orange-500/10 to-transparent",
    iconBg: "from-amber-500 to-orange-500",
  },
  {
    href: "/payments",
    title: "Оплата",
    description: "Цена, paywall, история транзакций",
    icon: Wallet,
    accent: "from-emerald-500/25 via-teal-500/10 to-transparent",
    iconBg: "from-emerald-500 to-teal-500",
  },
  {
    href: "/broadcasts",
    title: "Рассылки",
    description: "Сообщения участникам — все и сегментами",
    icon: Send,
    accent: "from-cyan-500/25 via-blue-500/10 to-transparent",
    iconBg: "from-cyan-500 to-blue-500",
  },
];

export function QuickActions() {
  return (
    <section className="space-y-3 animate-in" style={{ animationDelay: "60ms" }}>
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Быстрые действия</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              prefetch
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              style={{ animationDelay: `${80 + i * 60}ms` }}
            >
              <Card className="relative overflow-hidden hover-glow h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${a.accent} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-5 sm:p-6 flex flex-col h-full min-h-[180px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${a.iconBg} shadow-lg ring-1 ring-white/10`}>
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                    </div>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[0.04] text-muted-foreground transition-all group-hover:bg-white/[0.08] group-hover:text-foreground group-hover:rotate-[-12deg]">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight">{a.title}</h3>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
