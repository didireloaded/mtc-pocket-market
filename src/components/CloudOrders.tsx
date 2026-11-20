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
  if (query.isPending) return <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading your orders…</p>;
  if (query.error) return <div role="alert"><p className="text-sm text-destructive">{query.error.message}</p><Button variant="outline" className="mt-3 rounded-full" onClick={() => query.refetch()}><RefreshCw className="size-4" />Retry</Button></div>;
  return <div className="space-y-3">
    {query.data?.staff && <Button asChild variant="outline" className="w-full rounded-full"><Link to="/admin">Staff order management</Link></Button>}
    {!query.data?.orders.length && <p className="py-6 text-sm text-muted-foreground">No Cloud orders yet.</p>}
    {query.data?.orders.map((o) => <article key={o.id} className="rounded-[20px] bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 font-semibold"><Package className="size-4" />{o.id.slice(0, 8).toUpperCase()}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p></div><p className="font-bold">{nad(o.total)}</p></div>
      <p className="mt-3 text-sm capitalize text-mint">{statusLabel(o.status)} · {o.payment_status}</p>
      {o.tracking && <p className="mt-2 text-xs">Tracking: {o.tracking}</p>}
      <ol className="mt-3 space-y-3 border-l border-border pl-3">{query.data?.events.filter((e) => e.order_id === o.id).map((e) => <li key={e.id}><p className="text-xs font-semibold capitalize">{statusLabel(e.stage)}</p><p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()} · {e.note}</p></li>)}</ol>
      {query.data?.returns.filter((r) => r.order_id === o.id).map((r) => <p key={r.id} className="mt-3 text-xs">Return: {r.status}{r.review_note && ` · ${r.review_note}`}</p>)}
      {o.status === "delivered" && <Button variant="outline" className="mt-3 rounded-full" onClick={() => setReturnOrder(o.id)}>Request return</Button>}
      {returnOrder === o.id && <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}><textarea aria-label="Return reason" minLength={10} required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for your return" className="w-full rounded-xl border bg-background p-3 text-sm" /><Button disabled={mutation.isPending} className="rounded-full">Submit return</Button>{mutation.error && <p role="alert" className="text-xs text-destructive">{mutation.error.message}</p>}</form>}
    </article>)}
  </div>;
}