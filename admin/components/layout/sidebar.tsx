"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, ListChecks, Users, Send, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/welcome", label: "Приветствие", icon: MessageSquareText },
  { href: "/steps", label: "Шаги марафона", icon: ListChecks },
  { href: "/participants", label: "Участники", icon: Users },
  { href: "/broadcasts", label: "Рассылки", icon: Send },
];

export function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/30 backdrop-blur-xl">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500" />
          <div>
            <div className="text-sm font-semibold">Marafon</div>
            <div className="text-xs text-muted-foreground">admin</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                active
                  ? "bg-primary/15 text-foreground shadow-inner"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
