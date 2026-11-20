import { nad, quote, type Plan } from "@/lib/data";
import { PriceRow } from "@/components/retail/RetailPrimitives";

export function ContractBreakdown({ p, plan, opt = {} }: {
  p: { cash: number };
  plan: Plan;
  opt?: { months?: number; upfrontPct?: number };
}) {
  const q = quote(p, plan, opt);
  const totalOverTerm = Math.round((q.upfront + q.connection + q.monthly * q.months) * 100) / 100;
  return (
    <section className="border-y border-border py-5" aria-label="Illustrative contract breakdown">
      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-brand-red">Estimated contract costs</p>
      <h3 className="mt-1 text-[19px] font-bold tracking-[-0.03em]">{plan.name}</h3>
      <div className="mt-4 divide-y divide-border/70">
        <PriceRow label="Device instalment / month" value={nad(q.device)} />
        <PriceRow label="Plan subscription / month" value={nad(q.fee)} />
        <PriceRow label="Upfront device contribution" value={nad(q.upfront)} />
        <PriceRow label="Connection fee (once)" value={nad(q.connection)} />
        <PriceRow label="Contract duration" value={q.months + " months"} />
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-[13px] font-medium text-muted-foreground">Estimated monthly total</p>
        <p className="mt-1 text-[29px] font-bold leading-8 tracking-[-0.055em] tabular-nums">{nad(q.monthly)}<span className="ml-1 text-[13px] font-medium tracking-normal text-muted-foreground">/mo</span></p>
      </div>
      <div className="mt-4 rounded-[13px] bg-stage p-4">
        <p className="text-[13px] font-semibold text-muted-foreground">Estimated full-term commitment</p>
        <p className="mt-1 text-[24px] font-bold tracking-[-0.045em] tabular-nums">{nad(totalOverTerm)}</p>
        <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
          Includes {plan.data}, {plan.mins} and {plan.sms}. Illustrative only, not an official MTC quotation.
        </p>
      </div>
    </section>
  );
}
