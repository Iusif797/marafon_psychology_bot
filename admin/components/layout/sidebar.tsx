"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, ListChecks, Users, Send, LogOut, Sparkles, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/welcome", label: "Приветствие", icon: MessageSquareText },
  { href: "/steps", label: "Шаги марафона", icon: ListChecks },
  { href: "/payments", label: "Оплата", icon: Wallet },
  { href: "/participants", label: "Участники", icon: Users },
  { href: "/broadcasts", label: "Рассылки", icon: Send },
];

export function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/30 backdrop-blur-2xl">
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500 shadow-lg shadow-primary/30 ring-1 ring-white/10 transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">Marafon</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Admin</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "text-foreground bg-white/[0.04]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r-full bg-gradient-to-b from-primary to-fuchsia-500" />
              )}
              <Icon className={cn("h-[18px] w-[18px] transition-colors", active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/[0.04]">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
