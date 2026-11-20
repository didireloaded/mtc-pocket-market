import { nad, quote, type Plan } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { PriceRow, RetailPanel } from "@/components/retail/RetailPrimitives";

export function ContractBreakdown({ p, plan, opt = {} }: {
  p: { cash: number }; plan: Plan; opt?: { months?: number; upfrontPct?: number };
}) {
  const q = quote(p, plan, opt);
  const totalOverTerm = Math.round((q.upfront + q.connection + q.monthly * q.months) * 100) / 100;
  return <RetailPanel className="space-y-1 border-mint/20 bg-card">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div><p className="text-[12px] font-bold uppercase tracking-wide text-mint">Estimated breakdown</p>
        <h3 className="mt-1 text-[17px] font-bold">{plan.name}</h3></div>
      <Badge variant="secondary" className="rounded-full text-[11px]">Concept</Badge>
    </div>
    <PriceRow label="Device instalment / month" value={nad(q.device)} />
    <PriceRow label="Plan subscription / month" value={nad(q.fee)} />
    <PriceRow label="Upfront device contribution" value={nad(q.upfront)} />
    <PriceRow label="Connection fee (once)" value={nad(q.connection)} />
    <PriceRow label="Contract duration" value={q.months + " months"} />
    <PriceRow label="Total monthly" value={nad(q.monthly)} emphasis />
    <div className="mt-2 rounded-[16px] bg-surface-2 p-4">
      <p className="text-[12px] font-semibold text-muted-foreground">Estimated full-term commitment</p>
      <p className="mt-1 text-[24px] font-bold tracking-tight tabular-nums">{nad(totalOverTerm)}</p>
      <p className="mt-2 text-[12px] leading-5 text-muted-foreground">Includes {plan.data}, {plan.mins} and {plan.sms}. Illustrative amounts, not an official quote.</p>
    </div>
  </RetailPanel>;
}
