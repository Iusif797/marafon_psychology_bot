import { cn } from "@/lib/utils";

function renderHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/<(?!\/?(b|i|u|s|code|pre|a|br)\b)/g, "&lt;")
    .replace(/\n/g, "<br/>");
}

export function TelegramPreview({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-[#0f1419] border border-white/5 p-4", className)}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Preview · Telegram</div>
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#1d242c] px-4 py-2.5 shadow-lg">
          <div
            className="text-[14.5px] leading-[1.45] text-zinc-100 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: renderHtml(content || "—") }}
          />
          <div className="text-[11px] text-zinc-500 mt-1.5 text-right">12:34</div>
        </div>
      </div>
    </div>
  );
}
