import { Users } from "lucide-react";

export function EmptyState({ query }: { query: boolean }) {
  if (query) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <div className="text-muted-foreground">По заданному фильтру никого не нашлось.</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 mb-4">
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-base font-medium mb-1">Пока никто не пришёл</div>
      <div className="text-sm text-muted-foreground">
        Поделись ссылкой на бота — участники появятся здесь автоматически после <code>/start</code>.
      </div>
    </div>
  );
}
