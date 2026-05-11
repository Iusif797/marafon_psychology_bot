"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarathonStep } from "@/lib/db/schema";

type Props = {
  step: MarathonStep;
  index: number;
  onDelete: (id: number) => void;
};

export function SortableStep({ step, index, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "glass rounded-xl flex items-center gap-3 p-4 hover-glow",
        isDragging && "opacity-50 shadow-2xl",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Перетащить"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{step.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{step.text}</div>
      </div>
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/steps/${step.id}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(step.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
