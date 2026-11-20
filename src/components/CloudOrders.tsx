import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { loadOperations, submitReturn } from "@/lib/operations.functions";
import { statusLabel } from "@/lib/operations";
import { nad } from "@/lib/data";

export function CloudOrders() {
  const { user, setAuthOpen } = useStore();
  const load = useServerFn(loadOperations);
  const sendReturn = useServerFn(submitReturn);
  const cache = useQueryClient();
  const [returnOrder, setReturnOrder] = useState("");
  const [reason, setReason] = useState("");
  const query = useQuery({ queryKey: ["cloud-operations", user?.label], queryFn: () => load(), enabled: Boolean(user) });
  const mutation = useMutation({
    mutationFn: () => sendReturn({ data: { orderId: returnOrder, reason } }),
    onSuccess: () => { setReturnOrder(""); setReason(""); void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); },
  });

  if (!user) return <div className="rounded-[22px] bg-white px-5 py-7 text-center">
    <p className="text-[15px] font-semibold">Sign in to view requests</p>
    <p className="mt-2 text-[13px] text-muted-foreground">Your submitted requests are linked to your Pocket Market account.</p>
    <Button type="button" onClick={() => setAuthOpen(true)} className="mt-5 min-h-12 rounded-full px-6">Sign in</Button>
  </div>;

  if (query.isPending) return <div role="status" aria-live="polite" aria-label="Loading account requests" className="space-y-3">
    <span className="sr-only">Loading account requests…</span>
    {[0, 1].map((index) => <div key={index} aria-hidden="true"
      className="flex min-h-[112px] items-center gap-3 rounded-[20px] bg-white p-4">
      <div className="size-12 shrink-0 animate-pulse rounded-[16px] bg-[#E8ECEF] motion-reduce:animate-none" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#E8ECEF] motion-reduce:animate-none" />
        <div className="h-3 w-2/5 animate-pulse rounded-full bg-[#E8ECEF] motion-reduce:animate-none" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#E8ECEF] motion-reduce:animate-none" />
      </div>
    </div>)}
  </div>;

  if (query.error) return <div role="alert" className="rounded-[20px] bg-white p-5">
    <p className="text-[14px] text-muted-foreground">Couldn't load your requests. Check your connection.</p>
    <Button variant="outline" className="mt-4 min-h-11 rounded-full" onClick={() => { void query.refetch(); }}>
      <RefreshCw aria-hidden="true" className="size-4" /> Try again
    </Button>
  </div>;

  return <div className="space-y-3">
    {query.data?.staff && <Button asChild variant="outline" className="w-full rounded-full"><Link to="/admin">Staff order management</Link></Button>}
    {!query.data?.orders.length && <div className="rounded-[22px] bg-white px-5 py-8 text-center">
      <Package aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 text-[16px] font-semibold">No requests yet</p>
      <p className="mt-2 text-[13px] text-muted-foreground">Choose a device to begin.</p>
      <Button asChild className="mt-5 min-h-11 rounded-full"><Link to="/shop">Browse devices</Link></Button>
    </div>}

    {query.data?.orders.map((order) => (
      <article key={order.id} className="rounded-[20px] bg-white p-4 shadow-[0_6px_22px_rgba(0,0,0,0.03)]">
        <details className="group">
          <summary className="flex min-h-[66px] cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <span className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-stage">
              <Package aria-hidden="true" className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold">Request {order.id.slice(0, 8).toUpperCase()}</span>
              <span className="mt-1 block text-[12px] text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-NA", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="mt-1 block text-[12px] font-medium text-mint">{statusLabel(order.status)}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[15px] font-bold tabular-nums">{nad(order.total)}</span>
              <ChevronDown aria-hidden="true" className="ml-auto mt-2 size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="mt-3 border-t border-border pt-4">
            <p className="text-[12px] text-muted-foreground">Payment status: {order.payment_status}</p>
            {order.tracking && <p className="mt-2 text-[13px]">Tracking: {order.tracking}</p>}
            {(query.data?.events.filter((event) => event.order_id === order.id).length ?? 0) > 0 && <ol className="mt-4 space-y-3 border-l border-border pl-4">
              {query.data?.events.filter((event) => event.order_id === order.id).map((event) => (
                <li key={event.id}>
                  <p className="text-[13px] font-semibold">{statusLabel(event.stage)}</p>
                  <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                    {new Date(event.created_at).toLocaleDateString("en-NA")} {event.note && `· ${event.note}`}
                  </p>
                </li>
              ))}
            </ol>}
            {query.data?.returns.filter((item) => item.order_id === order.id).map((item) => (
              <p key={item.id} className="mt-3 text-[12px] text-muted-foreground">Return request: {item.status}{item.review_note && ` · ${item.review_note}`}</p>
            ))}
            {order.status === "delivered" && <Button type="button" variant="outline" className="mt-4 min-h-11 rounded-full"
              onClick={() => setReturnOrder(order.id)}>Request return</Button>}
            {returnOrder === order.id && <form className="mt-4 space-y-3"
              onSubmit={(event) => { event.preventDefault(); if (!mutation.isPending) mutation.mutate(); }}>
              <label htmlFor={`return-reason-${order.id}`} className="block text-[13px] font-semibold">Reason for return</label>
              <textarea id={`return-reason-${order.id}`} required minLength={10} maxLength={1000}
                value={reason} onChange={(event) => setReason(event.target.value)}
                placeholder="Explain what happened" className="min-h-28 w-full rounded-[13px] border bg-background p-3 text-[16px]" />
              <Button type="submit" disabled={mutation.isPending} className="min-h-12 rounded-full">
                {mutation.isPending ? "Submitting…" : "Submit return request"}
              </Button>
              {mutation.error && <p role="alert" className="text-[13px] text-destructive">We couldn't confirm this request. Check its status before trying again.</p>}
            </form>}
          </div>
        </details>
      </article>
    ))}
    {Boolean(query.data?.orders.length) && <p className="px-1 pt-2 text-[12px] leading-5 text-muted-foreground">
      A submitted request isn't a paid order. Follow-up, stock and delivery still need confirmation.
    </p>}
  </div>;
}
