"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TelegramPreview } from "@/components/editor/telegram-preview";
import { saveWelcomeBlock } from "@/actions/welcome";
import type { WelcomeKey } from "@/lib/db/queries/welcome";

type Props = {
  blockKey: WelcomeKey;
  title: string;
  hint: string;
  initial: string;
};

export function WelcomeBlockEditor({ blockKey, title, hint, initial }: Props) {
  const [value, setValue] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const dirty = value !== initial;

  function handleSave() {
    startTransition(async () => {
      const res = await saveWelcomeBlock(blockKey, value);
      if (res.ok) toast.success("Сохранено");
      else toast.error("Ошибка сохранения");
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{hint}</CardDescription>
          </div>
          <Button size="sm" onClick={handleSave} disabled={!dirty || isPending}>
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Сохранить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={10}
            placeholder="Текст блока…"
            className="min-h-[240px]"
          />
          <TelegramPreview content={value} className="min-h-[240px]" />
        </div>
      </CardContent>
    </Card>
  );
}
