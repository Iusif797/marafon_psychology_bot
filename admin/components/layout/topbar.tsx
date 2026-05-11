import { auth } from "@/lib/auth";

export async function Topbar({ title, description }: { title: string; description?: string }) {
  const session = await auth();
  return (
    <header className="border-b border-border bg-card/20 backdrop-blur-xl px-4 sm:px-8 py-4 lg:py-0 lg:h-16 flex items-center justify-between">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-none truncate">{title}</h1>
        {description && <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>}
      </div>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-sm font-medium">{session?.user?.name || "Admin"}</div>
          <div className="text-xs text-muted-foreground">{session?.user?.email}</div>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 shrink-0" />
      </div>
    </header>
  );
}
