import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Package, Truck, MapPin, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { useStore, type Order } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — MTC Store" }, { name: "description", content: "Track your MTC device deliveries from processing to out for delivery." }, { property: "og:title", content: "My Orders — MTC Store" }, { property: "og:description", content: "Track your MTC device deliveries." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Orders,
});
const steps = [{ l: "Processing", i: Package }, { l: "Shipped", i: Truck }, { l: "Out for delivery", i: MapPin }] as const;
/** Demo progression: advances one step per 2 minutes after the order is placed. */
const stage = (o: Order, now: number) => Math.min(2, Math.floor((now - o.placedAt) / 120000));

function Orders() {
  const { orders, user, setAuthOpen } = useStore();
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/mymtc" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="mt-5 text-3xl font-bold">My orders</h1>
        {!user && <button onClick={() => setAuthOpen(true)} className="mt-3 w-full rounded-2xl bg-card p-3 text-left text-sm text-muted-foreground">Browsing as guest — orders are saved on this device only. <span className="text-mint">Sign in</span></button>}
        {!orders.length && <div className="py-16 text-center text-muted-foreground">No orders yet.<Link to="/shop" className="mt-3 block font-semibold text-mint">Start shopping</Link></div>}
        <div className="mt-4 space-y-4">
          {orders.map((o) => {
            const phys = o.items.filter((i) => i.kind === "physical"); const dig = o.items.filter((i) => i.kind === "digital");
            const s = now ? stage(o, now) : 0;
            return (
              <div key={o.id} className="rounded-[20px] bg-card p-4">
                <div className="flex justify-between"><p className="font-semibold">{o.id}</p><p className="font-bold">{nad(o.total)}</p></div>
                <p className="text-xs text-muted-foreground">{new Date(o.placedAt).toLocaleString()}</p>
                {phys.length > 0 && (<>
                  <p className="mt-3 text-sm">{phys.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                  <ol className="mt-4 flex items-start">
                    {steps.map(({ l, i: I }, idx) => (
                      <li key={l} className="relative flex flex-1 flex-col items-center text-center">
                        {idx > 0 && <span className={"absolute right-1/2 top-4 h-0.5 w-full " + (idx <= s ? "bg-mint" : "bg-surface-2")} />}
                        <span className={"relative grid size-8 place-items-center rounded-full " + (idx <= s ? "bg-mint text-mint-foreground" : "bg-surface-2 text-muted-foreground")}>{idx < s ? <Check className="size-4" /> : <I className="size-4" />}</span>
                        <span className={"mt-2 text-[11px] " + (idx === s ? "font-semibold text-mint" : "text-muted-foreground")}>{l}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-xs text-muted-foreground">Delivering to {o.address}</p>
                </>)}
                {dig.length > 0 && <p className="mt-3 flex items-center gap-2 text-sm text-mint"><Wifi className="size-4" />{dig.map((i) => i.name).join(", ")} — delivered instantly</p>}
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
