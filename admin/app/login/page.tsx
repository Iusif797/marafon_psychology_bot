import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Marafon Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">Войди, чтобы редактировать марафон</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
