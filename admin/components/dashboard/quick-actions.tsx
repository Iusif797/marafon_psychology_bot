import Link from "next/link";
import { ArrowRight, MessageSquareText, ListChecks, Send } from "lucide-react";

import { Card } from "@/components/ui/card";

const actions = [
  {
    href: "/welcome",
    title: "Приветствие",
    description: "Тексты, которые видит участник до начала марафона",
    icon: MessageSquareText,
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  },
  {
    href: "/steps",
    title: "Шаги марафона",
    description: "Содержание каждого шага, порядок, задания",
    icon: ListChecks,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    href: "/broadcasts",
    title: "Рассылки",
    description: "Сообщения участникам — все и сегментами",
    icon: Send,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground px-1">Быстрые действия</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href} className="group">
              <Card className={`relative overflow-hidden hover-glow bg-gradient-to-br ${a.gradient} h-full`}>
                <div className="p-6 flex flex-col h-full min-h-[180px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-10 rounded-xl bg-foreground/5 border border-white/5 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-auto">
                    <div className="text-lg font-semibold">{a.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 leading-snug">{a.description}</div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
