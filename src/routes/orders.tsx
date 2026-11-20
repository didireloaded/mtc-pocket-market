import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, Package, Truck, MapPin, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { useStore } from "@/lib/store";
import { currentStage, timeline } from "@/lib/timeline";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — MTC Store" }, { name: "description", content: "Track your MTC device deliveries from processing to out for delivery." }, { property: "og:title", content: "My Orders — MTC Store" }, { property: "og:description", content: "Track your MTC device deliveries." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Orders,
});
const icons = { Processing: Package, Shipped: Truck, "Out for delivery": MapPin } as const;
const fmt = (t: number) => new Date(t).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Orders() {
  const { orders, user, setAuthOpen } = useStore();
  const [now, setNow] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 10000); return () => clearInterval(t); }, []);
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/mymtc" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="mt-5 text-3xl font-bold">My orders</h1>
        {!user && <button onClick={() => setAuthOpen(true)} className="mt-3 w-full rounded-2xl bg-card p-3 text-left text-sm text-muted-foreground">Browsing as guest — orders are saved on this device only. <span className="text-mint">Sign in</span></button>}
        {!orders.length && <div className="py-16 text-center text-muted-foreground">No orders yet.<Link to="/shop" className="mt-3 block font-semibold text-mint">Start shopping</Link></div>}
        <div className="mt-4 space-y-4">
          {orders.map((o) => {
            const tl = now ? timeline(o, now) : [];
            const stage = now ? currentStage(o, now) : undefined;
            const phys = o.items.filter((i) => i.kind === "physical"); const dig = o.items.filter((i) => i.kind === "digital");
            const isOpen = open === o.id;
            return (
              <div key={o.id} className="rounded-[20px] bg-card shadow-card p-4">
                <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full items-start justify-between text-left" aria-expanded={isOpen}>
                  <div><p className="font-semibold">{o.id}</p><p className="text-xs text-muted-foreground">Placed {fmt(o.placedAt)}</p>
                    {stage && <span className="mt-2 inline-block rounded-full bg-mint/15 px-2 py-0.5 text-xs font-semibold text-mint">{stage}</span>}</div>
                  <div className="flex items-center gap-2"><p className="font-bold">{nad(o.total)}</p><ChevronDown className={"size-4 transition " + (isOpen ? "rotate-180" : "")} /></div>
                </button>
                {isOpen && (
                  <div className="mt-4 space-y-4 border-t pt-4 text-sm">
                    {phys.length > 0 && (<div>
                      <p className="font-semibold">Shipped · {nad(o.shippedTotal)}</p>
                      <p className="text-muted-foreground">{phys.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Tracking <span className="font-mono text-foreground">{o.tracking}</span> · NamPost Courier</p>
                      <ol className="mt-4 space-y-0">
                        {tl.map((e, idx) => { const I = icons[e.stage]; return (
                          <li key={e.stage} className="relative flex gap-3 pb-5 last:pb-0">
                            {idx < tl.length - 1 && <span className={"absolute left-4 top-8 h-full w-0.5 " + (tl[idx + 1]!.reached ? "bg-mint" : "bg-surface-2")} />}
                            <span className={"relative grid size-8 shrink-0 place-items-center rounded-full " + (e.reached ? "bg-mint text-mint-foreground" : "bg-surface-2 text-muted-foreground")}>{e.reached && e.stage !== stage ? <Check className="size-4" /> : <I className="size-4" />}</span>
                            <div><p className={e.reached ? "font-semibold" : "text-muted-foreground"}>{e.stage}</p>
                              <p className="text-xs text-muted-foreground">{e.reached ? fmt(e.at) : `Expected ${fmt(e.at)}`}</p>
                              {e.reached && <p className="mt-0.5 text-xs text-muted-foreground">{e.note}</p>}</div>
                          </li>); })}
                      </ol>
                    </div>)}
                    {dig.length > 0 && <div><p className="flex items-center gap-2 font-semibold text-mint"><Wifi className="size-4" />Digital · {nad(o.digitalTotal)}</p>
                      <p className="text-muted-foreground">{dig.map((i) => i.name).join(", ")} — delivered instantly at {fmt(o.placedAt)}{o.esimEmail && ` · emailed to ${o.esimEmail}`}</p></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
