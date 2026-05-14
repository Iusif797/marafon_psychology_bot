"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { savePaymentSettings } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentFields } from "@/components/editor/attachment-fields";
import type { PaymentSettings } from "@/lib/db/schema";

import { TogglePill } from "./toggle-pill";

const DEFAULT_PAYWALL =
  "Готов изменить своё состояние, мышление и жизнь?\n\nТогда нажимай на ссылку ниже для оплаты и присоединяйся к 60-дневному марафону трансформации.";

export function PaymentSettingsForm({ settings }: { settings: PaymentSettings | null }) {
  const [enabled, setEnabled] = useState(settings?.enabled ?? true);
  const [amount, setAmount] = useState(settings?.amount ?? "29");
  const [currency, setCurrency] = useState(settings?.currency ?? "USD");
  const [paywallText, setPaywallText] = useState(settings?.paywallText || DEFAULT_PAYWALL);
  const [payButtonText, setPayButtonText] = useState(settings?.payButtonText || "Оплатить и начать");
  const [successText, setSuccessText] = useState(settings?.successText || "Оплата прошла. Поехали!");
  const [welcomeFile, setWelcomeFile] = useState(settings?.welcomeFile ?? "");
  const [welcomeCaption, setWelcomeCaption] = useState(settings?.welcomeCaption ?? "");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const res = await savePaymentSettings({
        enabled,
        amount: Number(amount),
        currency: currency.trim().toUpperCase(),
        paywallText,
        payButtonText,
        successText,
        welcomeFile,
        welcomeCaption,
      });
      if (res.ok) toast.success("Сохранено");
      else toast.error(res.error || "Не удалось сохранить");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TogglePill enabled={enabled} onChange={setEnabled} />
        <Field label="Цена">
          <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Валюта">
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
        </Field>
      </div>
      <Field label="Текст paywall">
        <Textarea rows={6} value={paywallText} onChange={(e) => setPaywallText(e.target.value)} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Текст кнопки">
          <Input value={payButtonText} onChange={(e) => setPayButtonText(e.target.value)} />
        </Field>
        <Field label="Сообщение после оплаты">
          <Input value={successText} onChange={(e) => setSuccessText(e.target.value)} />
        </Field>
      </div>
      <AttachmentFields
        file={welcomeFile ?? ""}
        caption={welcomeCaption ?? ""}
        onFileChange={setWelcomeFile}
        onCaptionChange={setWelcomeCaption}
        hint="Бот пришлёт этот файл сразу после успешной оплаты, перед первым днём марафона. Файл должен лежать в content/files/."
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Сохранить
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
      {children}
    </div>
  );
}
