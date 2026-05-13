import { Topbar } from "@/components/layout/topbar";
import { PaymentSettingsCard } from "@/components/payments/settings-card";
import { PaymentsHistory } from "@/components/payments/history";
import { PaymentsStats } from "@/components/payments/stats";
import { getSettings, paymentsList, paymentStats } from "@/lib/db/queries/payments";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const [settings, stats, history] = await Promise.all([
    getSettings(),
    paymentStats(),
    paymentsList(50),
  ]);
  return (
    <>
      <Topbar title="Оплата" description="Цена, текст paywall и история транзакций" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <PaymentsStats stats={stats} currency={settings?.currency ?? "USD"} />
        <PaymentSettingsCard settings={settings} />
        <PaymentsHistory rows={history} />
      </div>
    </>
  );
}
