import { CheckCircle2, Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn, formatRelative } from "@/lib/utils";
import type { Participant } from "@/lib/db/schema";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function gradient(id: number): string {
  const palette = [
    "from-violet-500 to-fuchsia-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-purple-500",
  ];
  return palette[id % palette.length];
}

export function ParticipantRow({ participant, totalSteps }: { participant: Participant; totalSteps: number }) {
  const stepLabel = participant.completed ? "Завершил" : `Шаг ${participant.currentStep + 1} из ${totalSteps}`;
  const progress = participant.completed
    ? 100
    : Math.min(100, Math.round(((participant.currentStep + 1) / Math.max(totalSteps, 1)) * 100));
  const StepIcon = participant.completed ? CheckCircle2 : Clock;
  return (
    <Card className="group relative overflow-hidden flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover-glow">
      <div
        className={cn(
          "shrink-0 h-11 w-11 rounded-full bg-gradient-to-br grid place-items-center text-xs font-semibold text-white ring-1 ring-white/10 shadow-md",
          gradient(participant.id),
        )}
      >
        {initials(participant.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="font-medium truncate tracking-tight">{participant.fullName}</div>
          {participant.username && (
            <div className="text-xs text-muted-foreground truncate">@{participant.username}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground mt-1">
          <StepIcon className={cn("h-3 w-3", participant.completed ? "text-emerald-400" : "text-muted-foreground")} />
          <span className="font-medium text-foreground/80">{stepLabel}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="truncate">{formatRelative(participant.startedAt)}</span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-[width] duration-500",
              participant.completed ? "from-emerald-400 to-teal-400" : "from-primary to-fuchsia-500",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
        <span className="text-sm font-semibold tabular-nums tracking-tight">{progress}%</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">прогресс</span>
      </div>
    </Card>
  );
}
