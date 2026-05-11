"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  steps: { position: number; title: string; count: number }[];
};

export function Filters({ steps }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    startTransition(() => router.push(`/participants?${params.toString()}`));
  }

  const status = searchParams.get("status") ?? "all";
  const step = searchParams.get("step") ?? "all";

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Поиск по имени или @username…"
          className="pl-9"
        />
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
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
