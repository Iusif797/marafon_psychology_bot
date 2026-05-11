"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [reveal, setReveal] = useState(false);
  const loading = pending || submitting;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(formData.get("email") ?? "").toLowerCase().trim(),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });
    setSubmitting(false);
    if (res?.error) {
      toast.error("Неверный email или пароль");
      return;
    }
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <Card className="glass hover-glow">
      <CardContent className="p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoFocus className="pl-10 h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Пароль
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <Input id="password" name="password" type={reveal ? "text" : "password"} required className="pl-10 pr-10 h-11" />
              <button
                type="button"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? "Скрыть пароль" : "Показать пароль"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" disabled={loading} className="group w-full h-11 bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-95">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Войти"}
            {!loading && <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
