"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, ListChecks, Users, Send, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/welcome", label: "Тексты", icon: MessageSquareText },
  { href: "/steps", label: "Шаги", icon: ListChecks },
  { href: "/participants", label: "Люди", icon: Users },
  { href: "/broadcasts", label: "Рассылки", icon: Send },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden sticky top-0 z-40 border-b border-white/[0.05] bg-background/70 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500 shadow-md shadow-primary/30">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-tight">Marafon</span>
        </Link>
      </div>
      <nav className="flex gap-1 px-3 pb-2.5 overflow-x-auto scrollbar-none">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "relative shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap",
                active
                  ? "text-foreground bg-white/[0.06] ring-1 ring-white/[0.08]"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
