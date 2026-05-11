"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, MessageSquareText, ListChecks, Users, Send, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Дашборд", icon: LayoutDashboard },
  { href: "/welcome", label: "Приветствие", icon: MessageSquareText },
  { href: "/steps", label: "Шаги", icon: ListChecks },
  { href: "/participants", label: "Участники", icon: Users },
  { href: "/broadcasts", label: "Рассылки", icon: Send },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500" />
          <span className="text-sm font-semibold">Marafon</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-muted-foreground hover:text-foreground transition-colors p-2"
          aria-label="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex gap-1 px-3 pb-2 overflow-x-auto scrollbar-none">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                active
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
