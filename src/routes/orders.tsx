import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Package, ShoppingBag, Wifi } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { useStore } from "@/lib/store";
import { CloudOrders } from "@/components/CloudOrders";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [
    { title: "Orders and requests — MTC Pocket Market" },
    { name: "description", content: "View account-linked order requests and separate browser-local demo purchases." },
    { property: "og:title", content: "Orders — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: Orders,
});

const formatDate = (at: number) => new Date(at).toLocaleString("en-NA", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
});

function Orders() {
  const { orders, user, setAuthOpen } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Shell>
      <div className="px-5 pb-10 pt-6">
        <Button asChild variant="secondary" size="icon" className="size-11 rounded-full bg-card shadow-none">
          <Link to="/mymtc" aria-label="Back to My MTC"><ArrowLeft className="size-5" /></Link>
        </Button>
        <h1 className="mt-6 text-[30px] font-bold tracking-tight">Orders and requests</h1>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          Account-linked order requests and local shopping previews appear separately.
        </p>

        <section className="mt-7" aria-labelledby="cloud-orders-title">
          <h2 id="cloud-orders-title" className="text-[19px] font-bold">Your account requests</h2>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            Submitted requests are stored with your Pocket Market account. They are not paid purchases.
          </p>
          <div className="mt-4"><CloudOrders /></div>
        </section>

        <section className="mt-9 border-t border-border pt-7" aria-labelledby="demo-orders-title">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-[13px] bg-surface-2">
              <ShoppingBag className="size-5 text-mint" />
            </div>
            <div>
              <h2 id="demo-orders-title" className="text-[19px] font-bold">Demo shopping history</h2>
              <p className="text-[13px] text-muted-foreground">Saved only in this browser</p>
            </div>
          </div>
          <p className="mt-4 rounded-[16px] border border-border bg-card p-4 text-[13px] leading-5 text-muted-foreground">
            These are local previews, not actual MTC orders. No payment, delivery, activation or customer notification was performed.
          </p>

          {!orders.length ? (
            <div className="mt-4 rounded-[20px] bg-card px-5 py-9 text-center">
              <Package aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
              <p className="mt-3 text-[15px] font-semibold">No demo orders yet</p>
              <p className="mt-2 text-[13px] leading-5 text-muted-foreground">You can explore devices and save a demonstration order in your bag.</p>
              <Button asChild className="mt-5 h-11 rounded-full px-5"><Link to="/shop">Explore devices</Link></Button>
            </div>
          ) : <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[20px] border border-border/70 bg-card p-4">
                <button type="button" aria-expanded={expanded === order.id}
                  aria-controls={`local-order-${order.id}`}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="flex min-h-12 w-full items-center justify-between gap-3 text-left">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{order.id}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{formatDate(order.placedAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-[15px] font-bold tabular-nums">{nad(order.total)}</p>
                      <p className="text-[12px] font-semibold text-mint">Local demo</p>
                    </div>
                    <ChevronDown className={`size-5 text-muted-foreground transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expanded === order.id && (
                  <div id={`local-order-${order.id}`} className="mt-4 border-t border-border pt-4">
                    <p className="text-[13px] font-semibold">Items in this preview</p>
                    <div className="mt-2 space-y-2">
                      {order.items.map((item, index) => <div key={index} className="flex items-start justify-between gap-3 text-[13px] text-muted-foreground">
                        <span>{item.name}</span><span className="shrink-0">{item.qty} × {item.kind}</span>
                      </div>)}
                    </div>
                    {order.address && <p className="mt-4 text-[13px] text-muted-foreground">Entered delivery details: {order.address}</p>}
                    {order.items.some((item) => item.kind === "digital") && <p className="mt-3 flex items-start gap-2 text-[13px] text-muted-foreground">
                      <Wifi aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> Digital items have not been activated or sent.
                    </p>}
                    <p className="mt-4 rounded-[14px] bg-surface-2 p-3 text-[13px] leading-5">
                      Saved locally only. There is no courier tracking or fulfilment status for this demo order.
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>}
          {!user && <Button type="button" variant="outline" onClick={() => setAuthOpen(true)}
            className="mt-5 min-h-12 w-full rounded-full text-[14px] font-semibold shadow-none">
            Sign in to view account requests
          </Button>}
        </section>
      </div>
    </Shell>
  );
}
