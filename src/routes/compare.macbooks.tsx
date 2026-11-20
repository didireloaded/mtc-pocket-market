import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { CONNECTION_FEE, nad, plans, products, quote } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare/macbooks")({
  head: () => ({ meta: [{ title: "MacBook: Outright vs Contract — MTC Store" }, { name: "description", content: "Compare MTC MacBook cash prices with Select contract plans: upfront costs, monthly payments and totals." }, { property: "og:title", content: "MacBook: Outright vs Contract — MTC Store" }, { property: "og:description", content: "Compare MacBook cash prices with MTC Select contract plans." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Compare,
});
const macs = products.filter((p) => p.category === "Laptops");
const select = plans.filter((p) => p.laptop);

function Compare() {
  const { add, kycDone } = useStore();
  const [months, setMonths] = useState<12 | 24 | 36>(24);
  const [upPct, setUpPct] = useState(0);
  const [macId, setMacId] = useState(macs[0]!.id);
  const mac = macs.find((m) => m.id === macId)!;
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/shop" search={{ c: "Laptops" }} aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-mint">Laptops on contract</p>
        <h1 className="text-3xl font-bold">MacBook: outright vs contract</h1>
        <p className="mt-1 text-sm text-muted-foreground">MacBooks are available on MTC Select Shared SIM plans over 12, 24 or 36 months.</p>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">{macs.map((m) => (
          <button key={m.id} onClick={() => setMacId(m.id)} className={cn("flex shrink-0 items-center gap-2 rounded-2xl border p-2 pr-4 text-left", macId === m.id ? "border-mint bg-card" : "bg-card/50")}>
            <img src={m.image} alt="" className="size-12 rounded-xl bg-stage object-contain p-1" /><div><p className="text-xs font-semibold">{m.name.replace("Apple ", "")}</p><p className="text-[11px] text-muted-foreground">{nad(m.cash)}</p></div></button>))}</div>

        <div className="mt-4 space-y-3 rounded-[20px] bg-card shadow-card p-4 text-sm">
          <div className="grid grid-cols-3 gap-2">{([12, 24, 36] as const).map((m) => <button key={m} onClick={() => setMonths(m)} className={cn("rounded-xl py-2 font-semibold", months === m ? "bg-mint text-mint-foreground" : "bg-surface-2 text-muted-foreground")}>{m} months</button>)}</div>
          <label className="block text-xs text-muted-foreground">Upfront device payment: <span className="text-foreground">{nad(Math.round(mac.cash * upPct))} ({Math.round(upPct * 100)}%)</span>
            <input aria-label="Upfront device payment" type="range" min={0} max={0.5} step={0.05} value={upPct} onChange={(e) => setUpPct(+e.target.value)} className="mt-2 w-full accent-[var(--mint)]" /></label>
        </div>

        <div className="mt-4 overflow-x-auto rounded-[20px] border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-card text-xs text-muted-foreground"><tr>
              <th className="p-3 font-medium">Option</th><th className="p-3 font-medium">Pay today</th><th className="p-3 font-medium">Monthly</th><th className="p-3 font-medium">Includes</th><th className="p-3 font-medium">Total over term</th><th className="p-3" />
            </tr></thead>
            <tbody>
              <tr className="border-t bg-surface-2/40">
                <td className="p-3 font-semibold">Buy outright</td><td className="p-3 font-bold">{nad(mac.cash)}</td><td className="p-3 text-muted-foreground">—</td><td className="p-3 text-muted-foreground">Device only</td><td className="p-3 font-semibold">{nad(mac.cash)}</td>
                <td className="p-3"><button onClick={() => add({ id: mac.id, name: mac.name, image: mac.image, variant: "Standard", price: mac.cash, kind: "physical", mode: "cash" })} className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Add</button></td>
              </tr>
              {select.map((pl) => { const q = quote(mac, pl, { months, upfrontPct: upPct }); const total = q.upfront + CONNECTION_FEE + q.monthly * months; return (
                <tr key={pl.id} className="border-t">
                  <td className="p-3"><p className="font-semibold">{pl.name}</p><p className="text-[11px] text-muted-foreground">{months} months</p></td>
                  <td className="p-3"><p className="font-bold">{nad(q.upfront + CONNECTION_FEE)}</p><p className="text-[11px] text-muted-foreground">{q.upfront ? `${nad(q.upfront)} + ` : ""}{nad(CONNECTION_FEE)} connection</p></td>
                  <td className="p-3"><p className="font-bold">{nad(q.monthly)}</p><p className="text-[11px] text-muted-foreground">{nad(q.device)} device + {nad(pl.fee)} plan</p></td>
                  <td className="p-3 text-xs text-muted-foreground">{pl.data} · {pl.mins} · {pl.sms}</td>
                  <td className="p-3 font-semibold">{nad(Math.round(total))}</td>
                  <td className="p-3"><button onClick={() => add({ id: mac.id, name: mac.name, image: mac.image, variant: `Standard · ${pl.name} · ${months} mo · ${pl.data}` + (q.upfront ? ` · ${nad(q.upfront)} upfront` : ""), price: q.monthly, kind: "physical", mode: "contract" })} className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-mint">Add</button></td>
                </tr>); })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Cash prices and plan fees as listed on mtc.com.na. Device instalments use MTC's 12-month rate (cash +5.5%); 24/36-month rates are estimates. Totals include plan fees, which also cover your data, minutes and SMS. {!kycDone && <>Contracts need a <Link to="/kyc" className="text-mint">VERIFI ID check</Link>.</>}</p>
      </div>
    </Shell>
  );
}
