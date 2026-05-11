"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { name: string | null; email: string | null; initial: string };

export function UserMenu({ name, email, initial }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Меню пользователя"
          className="group flex items-center gap-2.5 rounded-full p-0.5 pr-3 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500 text-sm font-semibold text-white ring-1 ring-white/10 shadow-lg shadow-primary/20">
            {initial}
          </span>
          <span className="hidden lg:block max-w-[140px] truncate text-left">
            <span className="block text-sm font-medium leading-tight truncate">{name || "Admin"}</span>
            {email && <span className="block text-[11px] text-muted-foreground truncate">{email}</span>}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{name || "Admin"}</p>
            {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
