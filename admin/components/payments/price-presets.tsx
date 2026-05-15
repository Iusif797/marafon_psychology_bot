"use client";

const PRESETS = ["29", "60", "99", "149"] as const;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function PricePresets({ value, onChange }: Props) {
  const normalized = String(value ?? "").replace(/\.00$/, "");
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Быстро</span>
      {PRESETS.map((preset) => {
        const active = normalized === preset;
        return (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={
              active
                ? "rounded-full px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground border border-primary"
                : "rounded-full px-3 py-1 text-xs font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            }
          >
            ${preset}
          </button>
        );
      })}
    </div>
  );
}
