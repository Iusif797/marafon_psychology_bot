import { SearchX, Users } from "lucide-react";

export function EmptyState({ query }: { query: boolean }) {
  const Icon = query ? SearchX : Users;
  const title = query ? "Ничего не нашлось" : "Пока никто не пришёл";
  const desc = query
    ? "Попробуй изменить запрос или сбросить фильтры."
    : "Поделись ссылкой на бота — участники появятся здесь автоматически после /start.";
  return (
    <div className="relative rounded-2xl border border-dashed border-white/[0.08] bg-card/30 backdrop-blur-xl p-10 sm:p-14 text-center overflow-hidden animate-in">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--ring)/0.08),transparent_60%)]" />
      <div className="relative">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] ring-1 ring-white/[0.08] mb-5">
          <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={2} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
