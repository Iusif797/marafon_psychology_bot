import { Sparkles } from "lucide-react";

import { AuroraBackground } from "@/components/login/aurora-background";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <AuroraBackground />
      <div className="relative w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-fuchsia-500 to-rose-500 shadow-2xl shadow-primary/40 mb-5 ring-1 ring-white/10">
            <Sparkles className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Marafon Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-2.5">
            Войди, чтобы управлять марафоном
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          Защищённый доступ · Только для администраторов
        </p>
      </div>
    </div>
  );
}
