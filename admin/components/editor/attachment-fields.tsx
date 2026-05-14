"use client";

import { Paperclip } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  file: string;
  caption: string;
  onFileChange: (v: string) => void;
  onCaptionChange: (v: string) => void;
  hint?: string;
};

export function AttachmentFields({ file, caption, onFileChange, onCaptionChange, hint }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-dashed border-border/60 p-4 bg-muted/30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Paperclip className="h-4 w-4 text-muted-foreground" />
        Вложение (PDF / документ)
      </div>
      <div className="space-y-2">
        <Label>Имя файла в content/files/</Label>
        <Input
          value={file}
          onChange={(e) => onFileChange(e.target.value)}
          placeholder="emotional_state_map.pdf"
        />
        <p className="text-xs text-muted-foreground">
          {hint ?? "Файл должен лежать в репозитории в папке content/files/. Оставь пустым, чтобы не прикреплять."}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Подпись к файлу (необязательно)</Label>
        <Textarea
          rows={2}
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Тест «Карта эмоционального состояния» — пройди и сохрани."
        />
      </div>
    </div>
  );
}
