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
  const stepLabel = participant.completed
    ? "Завершил"
    : `Шаг ${participant.currentStep + 1} из ${totalSteps}`;
  const StepIcon = participant.completed ? CheckCircle2 : Clock;
  return (
    <Card className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover-glow">
      <div
        className={cn(
          "shrink-0 h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-semibold text-white",
          gradient(participant.id),
        )}
      >
        {initials(participant.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="font-medium truncate">{participant.fullName}</div>
          {participant.username && (
            <div className="text-xs text-muted-foreground truncate">@{participant.username}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <StepIcon
            className={cn("h-3 w-3", participant.completed ? "text-emerald-400" : "text-muted-foreground")}
          />
          <span>{stepLabel}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>пришёл {formatRelative(participant.startedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
