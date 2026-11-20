import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadOperations, processOrder, reviewCase } from "@/lib/operations.functions";
import { nad } from "@/lib/data";
import { useStore } from "@/lib/store";
import { statusLabel } from "@/lib/operations";

export const Route = createFileRoute("/admin")({ head: () => ({ meta: [{ title: "MTC Staff — Order Operations" }, { name: "description", content: "Authorised staff order fulfilment, identity reviews and return management." }, { property: "og:title", content: "MTC Staff Order Operations" }, { property: "og:description", content: "Manage Cloud orders, identity reviews and returns with staff-only access." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }), component: Admin });
function Admin() {
  const { user, setAuthOpen } = useStore();
  const load = useServerFn(loadOperations), process = useServerFn(processOrder), review = useServerFn(reviewCase);
  const cache = useQueryClient();
  const [tab, setTab] = useState("orders"), [note, setNote] = useState(""), [tracking, setTracking] = useState("");
  const query = useQuery({ queryKey: ["cloud-operations", user?.label], queryFn: () => load(), enabled: Boolean(user) });
  const mutation = useMutation({ mutationFn: async (action: { id: string; kind: "order" | "kyc" | "return"; status: string }) => {
    if (action.kind === "order") await process({ data: { id: action.id, status: action.status as "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled", tracking, note } });
    else await review({ data: { id: action.id, kind: action.kind, status: action.status as "approved" | "rejected" | "received" | "closed", note } });
  }, onSuccess: () => { setNote(""); setTracking(""); void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); } });
  const act = (id: string, kind: "order" | "kyc" | "return", status: string) => mutation.mutate({ id, kind, status });
  return <Shell><div className="px-5 pt-6 pb-10"><Button asChild size="icon" variant="secondary" className="rounded-full"><Link to="/orders" aria-label="Back to orders"><ArrowLeft className="size-5" /></Link></Button><p className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase text-mint"><ShieldCheck className="size-4" />Staff workspace</p><h1 className="mt-2 text-3xl font-bold">Order operations</h1>
    {!user ? <Button className="mt-6 rounded-full" onClick={() => setAuthOpen(true)}>Staff sign in</Button> : query.isPending ? <Loader2 className="mt-6 size-5 animate-spin" /> : query.error ? <p role="alert" className="mt-5 text-destructive">{query.error.message}</p> : !query.data?.staff ? <p className="mt-6 text-sm text-muted-foreground">This account has no staff access. An authorised administrator must grant access.</p> : <>
      <Tabs value={tab} onValueChange={setTab} className="mt-6"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="kyc">KYC</TabsTrigger><TabsTrigger value="returns">Returns</TabsTrigger></TabsList></Tabs>
      <div className="mt-4 flex items-center justify-between"><p className="text-xs text-muted-foreground">Cloud records</p><Button variant="ghost" size="icon" aria-label="Refresh records" onClick={() => query.refetch()}><RefreshCw className="size-4" /></Button></div>
      <textarea aria-label="Staff review note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Review or fulfilment note" className="mt-2 w-full rounded-xl border bg-card p-3 text-sm" />
      {tab === "orders" && <input aria-label="Tracking reference" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Courier tracking reference" className="mt-2 h-11 w-full rounded-xl border bg-card px-3 text-sm" />}
      {mutation.error && <p role="alert" className="mt-3 text-sm text-destructive">{mutation.error.message}</p>}
      <div className="mt-4 space-y-3">
      {tab === "orders" && query.data.orders.map((o) => <article key={o.id} className="rounded-[20px] bg-card p-4"><div className="flex justify-between gap-2"><h2 className="font-semibold">{o.id.slice(0, 8).toUpperCase()}</h2><p className="font-bold">{nad(o.total)}</p></div><p className="mt-2 text-xs capitalize">{statusLabel(o.status)} · {o.payment_status}</p><p className="mt-2 text-xs text-muted-foreground">{JSON.stringify(o.items)}</p><div className="mt-3 flex flex-wrap gap-2">{o.payment_status === "paid" && o.status === "awaiting_payment" && <Button disabled={mutation.isPending} className="rounded-full" onClick={() => act(o.id, "order", "processing")}>Process order</Button>}{o.status === "processing" && <Button disabled={mutation.isPending || !tracking.trim()} className="rounded-full" onClick={() => act(o.id, "order", "shipped")}>Mark shipped</Button>}{o.status === "shipped" && <Button disabled={mutation.isPending} className="rounded-full" onClick={() => act(o.id, "order", "out_for_delivery")}>Out for delivery</Button>}{o.status === "out_for_delivery" && <Button disabled={mutation.isPending} className="rounded-full" onClick={() => act(o.id, "order", "delivered")}>Mark delivered</Button>}{["awaiting_payment", "processing"].includes(o.status) && <Button variant="outline" disabled={mutation.isPending} className="rounded-full" onClick={() => act(o.id, "order", "cancelled")}>Cancel order</Button>}</div></article>)}
      {tab === "kyc" && query.data.kyc.map((k) => <article key={k.id} className="rounded-[20px] bg-card p-4"><h2 className="font-semibold">{k.reference}</h2><p className="mt-2 text-xs capitalize">{k.status}</p><p className="text-xs text-muted-foreground">{k.review_note}</p>{k.status === "pending" && <div className="mt-3 flex gap-2"><Button disabled={mutation.isPending || !note.trim()} className="rounded-full" onClick={() => act(k.id, "kyc", "approved")}>Approve</Button><Button variant="outline" disabled={mutation.isPending || !note.trim()} className="rounded-full" onClick={() => act(k.id, "kyc", "rejected")}>Reject</Button></div>}</article>)}
      {tab === "returns" && query.data.returns.map((r) => <article key={r.id} className="rounded-[20px] bg-card p-4"><h2 className="font-semibold">Order {r.order_id.slice(0, 8).toUpperCase()}</h2><p className="mt-2 text-sm">{r.reason}</p><p className="mt-2 text-xs capitalize">{r.status} · {r.review_note}</p><div className="mt-3 flex flex-wrap gap-2">{(r.status === "requested" ? ["approved", "rejected"] : r.status === "approved" ? ["received"] : r.status === "received" ? ["closed"] : []).map((s) => <Button key={s} disabled={mutation.isPending || !note.trim()} className="rounded-full capitalize" onClick={() => act(r.id, "return", s)}>{s}</Button>)}</div></article>)}
      {(tab === "orders" ? query.data.orders : tab === "kyc" ? query.data.kyc : query.data.returns).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No {tab === "kyc" ? "identity cases" : tab} yet.</p>}
      </div><p className="mt-6 text-xs leading-5 text-muted-foreground">Fulfilment requires confirmed payment. KYC decisions here are staff reviews of an official reference, not automated VERIFI checks. Closing a return does not issue a refund.</p>
    </>}
  </div></Shell>;
}