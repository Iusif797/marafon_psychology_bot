"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  steps: { position: number; title: string; count: number }[];
};

export function Filters({ steps }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    startTransition(() => router.push(`/participants?${params.toString()}`, { scroll: false }));
  }

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setParam("q", query.trim() || null), 220);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const status = searchParams.get("status") ?? "all";
  const step = searchParams.get("step") ?? "all";

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени или @username…"
          className="pl-10 pr-10 h-11"
        />
        {query && !pending && (
          <button
            onClick={() => setQuery("")}
            aria-label="Очистить поиск"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {pending && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground/70" />}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "active", "completed"] as const).map((s) => (
          <Chip key={s} active={status === s} onClick={() => setParam("status", s === "all" ? null : s)}>
            {s === "all" ? "Все" : s === "active" ? "Активные" : "Завершили"}
          </Chip>
        ))}
        <div className="w-full sm:w-px h-px sm:h-6 bg-border my-1 sm:my-0 sm:mx-2" />
        <Chip active={step === "all"} onClick={() => setParam("step", null)}>
          Все шаги
        </Chip>
        {steps.map((s) => (
          <Chip key={s.position} active={step === String(s.position)} onClick={() => setParam("step", String(s.position))}>
            {s.position + 1}: {s.count}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap ring-1 ring-inset",
        active
          ? "bg-primary/20 text-foreground ring-primary/40 shadow-[0_0_0_3px_hsl(var(--ring)/0.08)]"
          : "bg-white/[0.02] text-muted-foreground ring-white/[0.05] hover:bg-white/[0.04] hover:text-foreground hover:ring-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}
