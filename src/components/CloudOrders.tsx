import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Loader2, Package, RefreshCw } from "lucide-react";
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
  const mutation = useMutation({ mutationFn: () => sendReturn({ data: { orderId: returnOrder, reason } }), onSuccess: () => { setReturnOrder(""); setReason(""); void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); } });
  if (!user) return <div className="bg-card rounded-[20px] p-4"><p className="text-sm text-muted-foreground">Sign in to see orders saved to your account.</p><Button onClick={() => setAuthOpen(true)} className="mt-3 rounded-full">Sign in</Button></div>;
  if (query.isPending) return <p role="status" aria-live="polite" className="flex min-h-20 items-center gap-2 text-[14px] text-muted-foreground"><Loader2 aria-hidden="true" className="size-5 animate-spin" />Loading account requests…</p>;
  if (query.error) return <div role="alert" className="rounded-[18px] border bg-card p-4"><p className="text-[14px] leading-6 text-muted-foreground">Account requests could not be loaded. Check your connection and try again.</p><Button variant="outline" className="mt-3 min-h-11 rounded-full" onClick={() => { void query.refetch(); }}><RefreshCw className="size-4" />Retry loading</Button></div>;
  return <div className="space-y-3">
    {query.data?.staff && <Button asChild variant="outline" className="w-full rounded-full"><Link to="/admin">Staff order management</Link></Button>}
    {!query.data?.orders.length && <div className="rounded-[18px] bg-card p-5"><p className="text-[15px] font-semibold">No account requests yet</p><p className="mt-2 text-[14px] leading-6 text-muted-foreground">Browse devices and save an order request when you’re ready.</p><Button asChild variant="outline" className="mt-4 min-h-11 rounded-full"><Link to="/shop">Explore devices</Link></Button></div>}
    {query.data?.orders.map((o) => <article key={o.id} className="rounded-[20px] bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 font-semibold"><Package className="size-4" />{o.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p></div><p className="font-bold">{nad(o.total)}</p></div>
      <p className="mt-3 text-sm capitalize text-mint">{statusLabel(o.status)} · {o.payment_status}</p>
      {o.tracking && <p className="mt-2 text-xs">Tracking: {o.tracking}</p>}
      <ol className="mt-3 space-y-3 border-l border-border pl-3">{query.data?.events.filter((e) => e.order_id === o.id).map((e) => <li key={e.id}><p className="text-xs font-semibold capitalize">{statusLabel(e.stage)}</p><p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()} · {e.note}</p></li>)}</ol>
      {query.data?.returns.filter((r) => r.order_id === o.id).map((r) => <p key={r.id} className="mt-3 text-xs">Return: {r.status}{r.review_note && ` · ${r.review_note}`}</p>)}
      {o.status === "delivered" && <Button variant="outline" className="mt-3 rounded-full" onClick={() => setReturnOrder(o.id)}>Request return</Button>}
      {returnOrder === o.id && <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!mutation.isPending) mutation.mutate(); }}><label className="block text-[14px] font-semibold" htmlFor={`return-reason-${o.id}`}>Reason for return</label><textarea id={`return-reason-${o.id}`} minLength={10} maxLength={1000} required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain what happened" className="min-h-28 w-full rounded-xl border bg-background p-3 text-[16px]" /><Button disabled={mutation.isPending} className="min-h-12 rounded-full">{mutation.isPending ? "Submitting…" : "Submit return request"}</Button>{mutation.error && <p role="alert" className="text-[13px] leading-5 text-destructive">We couldn’t confirm this request. Check the latest status before submitting again.</p>}</form>}
    </article>)}
  </div>;
}