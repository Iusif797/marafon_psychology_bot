import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatRelative } from "@/lib/utils";

type Row = {
  id: string;
  userId: number;
  amount: string;
  currency: string;
  status: string;
  createdAt: Date | null;
  fullName: string | null;
  username: string | null;
};

const STATUS = {
  paid: { label: "Оплачено", icon: CheckCircle2, color: "text-emerald-400" },
  pending: { label: "Ожидание", icon: Clock, color: "text-amber-400" },
  declined: { label: "Отклонено", icon: XCircle, color: "text-rose-400" },
  cancelled: { label: "Отменено", icon: XCircle, color: "text-rose-400" },
  failed: { label: "Ошибка", icon: XCircle, color: "text-rose-400" },
} as const;

export function PaymentsHistory({ rows }: { rows: Row[] }) {
  return (
    <Card className="animate-in" style={{ animationDelay: "240ms" }}>
      <CardHeader>
        <CardTitle>История платежей</CardTitle>
        <CardDescription>Последние 50 транзакций. Обновляется автоматически.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Платежей пока нет.</div>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {rows.map((row) => <PaymentItem key={row.id} row={row} />)}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentItem({ row }: { row: Row }) {
  const meta = STATUS[row.status as keyof typeof STATUS] ?? STATUS.pending;
  const Icon = meta.icon;
  const name = row.fullName || `ID ${row.userId}`;
  return (
    <li className="flex items-center gap-3 py-3.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium truncate">{name}</span>
          {row.username && <span className="text-xs text-muted-foreground truncate">@{row.username}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
          <Icon className={cn("h-3 w-3", meta.color)} />
          <span className="font-medium">{meta.label}</span>
          {row.createdAt && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span>{formatRelative(row.createdAt)}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold tabular-nums tracking-tight">
          {Number(row.amount).toLocaleString("en-US", { maximumFractionDigits: 2 })} {row.currency}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-mono">
          {row.id.slice(0, 8)}
        </div>
      </div>
    </li>
  );
}
