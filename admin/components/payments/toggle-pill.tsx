import { Label } from "@/components/ui/label";

type Props = { enabled: boolean; onChange: (value: boolean) => void };

export function TogglePill({ enabled, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Платный доступ</Label>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`group flex items-center gap-3 h-10 w-full px-3 rounded-lg border transition-all ${
          enabled ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/[0.08] bg-white/[0.02]"
        }`}
      >
        <span
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? "bg-emerald-500" : "bg-white/[0.08]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </span>
        <span className="text-sm font-medium">{enabled ? "Включён" : "Выключен — доступ бесплатный"}</span>
      </button>
    </div>
  );
}
