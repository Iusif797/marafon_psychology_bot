export function HtmlHint() {
  const tags = [
    { tag: "<b>текст</b>", label: "жирный" },
    { tag: "<i>текст</i>", label: "курсив" },
    { tag: "<u>текст</u>", label: "подчёркивание" },
    { tag: "<s>текст</s>", label: "зачёркнутый" },
    { tag: "<a href=\"https://…\">текст</a>", label: "ссылка" },
    { tag: "<code>код</code>", label: "моноширинный" },
  ];
  return (
    <div className="text-xs text-muted-foreground">
      <div className="mb-1.5 font-medium">Поддерживается HTML:</div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t.tag} className="px-2 py-0.5 rounded bg-muted/40 font-mono text-[11px]">
            {t.tag}
          </span>
        ))}
      </div>
    </div>
  );
}
