import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentSettings } from "@/lib/db/schema";

import { PaymentSettingsForm } from "./settings-form";

export function PaymentSettingsCard({ settings }: { settings: PaymentSettings | null }) {
  return (
    <Card className="animate-in" style={{ animationDelay: "180ms" }}>
      <CardHeader>
        <CardTitle>Настройки paywall</CardTitle>
        <CardDescription>Текст и цена, которые видит участник перед оплатой.</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentSettingsForm settings={settings} />
      </CardContent>
    </Card>
  );
}
