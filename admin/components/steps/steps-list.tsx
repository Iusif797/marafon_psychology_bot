"use client";

import { useState, useTransition } from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";

import { SortableStep } from "./sortable-step";
import { deleteStepAction, reorderStepsAction } from "@/actions/steps";
import type { MarathonStep } from "@/lib/db/schema";

export function StepsList({ initial }: { initial: MarathonStep[] }) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(async () => {
      const res = await reorderStepsAction(next.map((s) => s.id));
      if (!res.ok) toast.error("Не удалось сохранить порядок");
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Удалить шаг? Действие нельзя отменить.")) return;
    setItems((prev) => prev.filter((s) => s.id !== id));
    startTransition(async () => {
      await deleteStepAction(id);
      toast.success("Шаг удалён");
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Шагов пока нет. Создай первый.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((step, i) => (
            <SortableStep key={step.id} step={step} index={i} onDelete={handleDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
