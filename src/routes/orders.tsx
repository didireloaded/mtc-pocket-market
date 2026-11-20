import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Package, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { useStore } from "@/lib/store";
import { CloudOrders } from "@/components/CloudOrders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  validateSearch: (search: Record<string, unknown>): { tab?: "requests" | "previews" } => {
    const tab = search["tab"];
    return tab === "requests" || tab === "previews" ? { tab } : {};
  },
  head: () => ({ meta: [
    { title: "Orders — MTC Pocket Market" },
    { name: "description", content: "View account-linked order requests or shopping previews saved on this device." },
    { property: "og:title", content: "Orders — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: Orders,
});

const formatDate = (time: number) => new Date(time).toLocaleDateString("en-NA", {
  day: "numeric", month: "short", year: "numeric",
});

function Orders() {
  const { orders, user } = useStore();
  const { tab } = Route.useSearch();
  const active = tab ?? (orders.length ? "previews" : "requests");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Shell>
      <div className="px-5 pb-12 pt-[max(28px,env(safe-area-inset-top))]">
        <p className="text-[12px] font-bold uppercase tracking-[0.11em] text-primary">POCKET MARKET</p>
        <h1 className="mt-1 text-[34px] font-bold tracking-[-0.055em]">Orders</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">Your requests and saved shopping previews.</p>

        <nav aria-label="Order views" className="mt-7 grid grid-cols-2 rounded-full bg-[#E6E9EB] p-1">
          <Link to="/orders" search={{ tab: "requests" }} aria-current={active === "requests" ? "page" : undefined}
            className={cn("grid min-h-11 place-items-center rounded-full px-2 text-[13px] font-semibold transition-colors",
              active === "requests" ? "bg-[#202E39] text-white" : "text-[#596470]")}>
            Requests
          </Link>
          <Link to="/orders" search={{ tab: "previews" }} aria-current={active === "previews" ? "page" : undefined}
            className={cn("grid min-h-11 place-items-center rounded-full px-2 text-[13px] font-semibold transition-colors",
              active === "previews" ? "bg-[#202E39] text-white" : "text-[#596470]")}>
            Saved previews{orders.length > 0 ? ` (${orders.length})` : ""}
          </Link>
        </nav>

        {active === "requests" ? <section aria-labelledby="account-requests-heading" className="mt-7">
          <h2 id="account-requests-heading" className="text-[20px] font-bold tracking-[-0.035em]">Account requests</h2>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            {user ? "Requests linked to your Pocket Market sign-in." : "Sign in to view requests submitted from your account."}
          </p>
          <div className="mt-5"><CloudOrders /></div>
        </section> : <section aria-labelledby="previews-heading" className="mt-7">
          <h2 id="previews-heading" className="text-[20px] font-bold tracking-[-0.035em]">Saved on this device</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Shopping plans you've kept for later.</p>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-[24px] bg-white px-6 py-10 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#F4F5F7]">
                <ShoppingBag aria-hidden="true" className="size-7 text-[#202E39]" />
              </span>
              <p className="mt-4 text-[18px] font-semibold">Nothing saved yet</p>
              <p className="mt-2 text-[14px] text-muted-foreground">Choose a device, then save a shopping preview from Cart.</p>
              <Link to="/shop" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#202E39] px-6 text-[14px] font-semibold text-white">
                Explore devices <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          ) : <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="overflow-hidden rounded-[20px] bg-white px-4 py-4 shadow-[0_6px_22px_rgba(0,0,0,0.03)]">
                <button type="button" aria-expanded={expanded === order.id}
                  aria-controls={`saved-order-${order.id}`}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="flex min-h-[66px] w-full items-center gap-3 text-left">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-stage">
                    <Package aria-hidden="true" className="size-6 text-[#202E39]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">
                      {order.items[0]?.name ?? "Shopping preview"}
                      {order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                    </span>
                    <span className="mt-1 block text-[12px] text-muted-foreground">{formatDate(order.placedAt)} · Saved locally</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[15px] font-bold tabular-nums">{nad(order.total)}</span>
                    <ChevronDown aria-hidden="true" className={cn("ml-auto mt-1 size-4 text-muted-foreground transition-transform", expanded === order.id && "rotate-180")} />
                  </span>
                </button>
                {expanded === order.id && <div id={`saved-order-${order.id}`} className="mt-4 border-t border-border pt-4">
                  <p className="text-[12px] font-semibold text-muted-foreground">Reference {order.id}</p>
                  <div className="mt-3 space-y-2">
                    {order.items.map((item, index) => <div key={index} className="flex justify-between gap-3 text-[14px]">
                      <span>{item.name}</span><span className="shrink-0 text-muted-foreground">×{item.qty}</span>
                    </div>)}
                  </div>
                  {order.address && <p className="mt-4 text-[13px] leading-5 text-muted-foreground">Entered address: {order.address}</p>}
                  <p className="mt-4 rounded-[12px] bg-[#F4F5F7] p-3 text-[12px] leading-5 text-muted-foreground">
                    Saved as a shopping preview only. No payment, stock reservation, activation or delivery was started.
                  </p>
                </div>}
              </article>
            ))}
          </div>}
        </section>}
      </div>
    </Shell>
  );
}
