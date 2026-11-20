import { nad, quote, type Plan } from "@/lib/data";

export function ContractBreakdown({ p, plan }: { p: { cash: number; contract: number }; plan: Plan }) {
  const q = quote(p, plan);
  const rows = [
    ["Device payment", nad(q.device) + "/mo"],
    ["Plan fee", nad(q.fee) + "/mo"],
    ["Upfront", q.upfront ? nad(q.upfront) : "N$0"],
    ["Contract term", q.months + " months"],
    ["Included", `${plan.data} · ${plan.mins} · ${plan.sms}`],
  ];
  return (
    <div className="rounded-[20px] border border-mint/30 bg-card p-4 text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mint">{plan.name} breakdown</p>
      {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-1"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>)}
      <div className="mt-2 flex justify-between border-t pt-2 font-bold"><span>Total monthly</span><span>{nad(q.monthly)}/mo</span></div>
    </div>
  );
}
