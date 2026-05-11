import { auth } from "@/lib/auth";

import { LiveStatus } from "./live-status";
import { UserMenu } from "./user-menu";

export async function Topbar({ title, description }: { title: string; description?: string }) {
  const session = await auth();
  const initial = (session?.user?.name || session?.user?.email || "A").charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-card/20 px-4 sm:px-8 py-3.5 lg:py-0 lg:h-16 flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-base sm:text-lg font-semibold leading-tight truncate tracking-tight">{title}</h1>
        {description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>}
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <LiveStatus />
        <UserMenu name={session?.user?.name ?? null} email={session?.user?.email ?? null} initial={initial} />
      </div>
    </header>
  );
}
