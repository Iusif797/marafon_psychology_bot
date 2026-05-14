"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TelegramPreview } from "@/components/editor/telegram-preview";
import { HtmlHint } from "@/components/editor/html-hint";
import { AttachmentFields } from "@/components/editor/attachment-fields";
import { createStepAction, updateStepAction } from "@/actions/steps";

type Props = {
  id?: number;
  initial?: {
    title: string;
    text: string;
    task: string;
    button: string;
    attachmentFile?: string | null;
    attachmentCaption?: string | null;
  };
};

export function StepForm({ id, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [task, setTask] = useState(initial?.task ?? "");
  const [button, setButton] = useState(initial?.button ?? "Далее");
  const [attachmentFile, setAttachmentFile] = useState(initial?.attachmentFile ?? "");
  const [attachmentCaption, setAttachmentCaption] = useState(initial?.attachmentCaption ?? "");
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("text", text);
      fd.set("task", task);
      fd.set("button", button);
      fd.set("attachmentFile", attachmentFile);
      fd.set("attachmentCaption", attachmentCaption);
      const res = id != null ? await updateStepAction(id, fd) : await createStepAction(fd);
      if (res && !res.ok) toast.error(res.error || "Ошибка");
      else if (res?.ok) toast.success("Сохранено");
    });
  }

  const preview = `<b>${title || "Заголовок"}</b>\n\n${text || "Текст шага…"}`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/steps">
            <ArrowLeft className="h-4 w-4" />
            К списку
          </Link>
        </Button>
        <Button onClick={submit} disabled={isPending || !title || !text}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Сохранить
        </Button>
      </div>
      <HtmlHint />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Содержание шага</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Шаг 1. Точка А" />
            </div>
            <div className="space-y-2">
              <Label>Основной текст</Label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} />
            </div>
            <div className="space-y-2">
              <Label>Задание (необязательно)</Label>
              <Textarea value={task} onChange={(e) => setTask(e.target.value)} rows={5} />
            </div>
            <div className="space-y-2">
              <Label>Подпись кнопки</Label>
              <Input value={button} onChange={(e) => setButton(e.target.value)} placeholder="Я сделал" />
            </div>
            <AttachmentFields
              file={attachmentFile ?? ""}
              caption={attachmentCaption ?? ""}
              onFileChange={setAttachmentFile}
              onCaptionChange={setAttachmentCaption}
            />
          </CardContent>
        </Card>
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          <TelegramPreview content={preview} />
          {task && <TelegramPreview content={task} />}
        </div>
      </div>
    </div>
  );
}
