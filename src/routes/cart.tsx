import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Truck, Wifi, Tag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { useStore, type CartItem } from "@/lib/store";
import { summarize, type Address } from "@/lib/checkout";
import { EsimEmail } from "@/components/EsimEmail";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — MTC Store" }, { name: "description", content: "Review devices and digital services, apply a promo code and check out." }, { property: "og:title", content: "Your Bag — MTC Store" }, { property: "og:description", content: "Review devices and digital services, apply a promo code and check out." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Cart,
});
function Row({ i }: { i: CartItem }) {
  const { setQty, remove } = useStore();
  return (
    <div className="flex gap-3 rounded-[20px] bg-card p-3">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-2">{i.image ? <img src={i.image} alt={i.name} className="size-full object-cover" /> : <Wifi className="text-mint" />}</div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2"><p className="truncate font-semibold">{i.name}</p>
          <button aria-label="Remove" onClick={() => remove(i.key)} className="text-muted-foreground hover:text-primary"><Trash2 className="size-4" /></button></div>
        <p className="truncate text-xs text-muted-foreground">{i.variant}{i.mode === "contract" && " · contract"}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-bold">{nad(i.price * i.qty)}{i.mode === "contract" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}</p>
          <div className="flex items-center gap-3 rounded-full bg-surface-2 px-2 py-1">
            <button aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)}><Minus className="size-4" /></button>
            <span className="w-4 text-center text-sm font-semibold">{i.qty}</span>
            <button aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)}><Plus className="size-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Cart() {
  const { cart, clear, kycDone, placeOrder, user } = useStore();
  const [orderId, setOrderId] = useState("");
  const [addr, setAddr] = useState<Address>({ name: "", street: "12 Independence Ave", town: "Windhoek", phone: "" });
  const [esimEmail, setEsimEmail] = useState(user?.method === "email" ? user.label : "");
  const [code, setCode] = useState(""); const [promo, setPromo] = useState<number | null>(null); const [err, setErr] = useState("");
  const [paid, setPaid] = useState<null | { hasEsim: boolean; hasShipped: boolean; email: string }>(null);
  const [tried, setTried] = useState(false);
  const s = summarize(cart, { promo, addr, kycDone, esimEmail });
  const { shipped, digital } = s;
  const pay = () => {
    setTried(true);
    if (s.errors.length) return;
    setOrderId(placeOrder({ items: cart.map((i) => ({ name: i.name, qty: i.qty, kind: i.kind })), total: s.total, shippedTotal: shipped.total, digitalTotal: digital.total, esimEmail, address: shipped.items.length ? `${addr.street}, ${addr.town}` : "" }));
    setPaid({ hasEsim: digital.hasEsim, hasShipped: shipped.items.length > 0, email: esimEmail }); setTimeout(clear, 0);
  };
  if (paid) return (
    <Shell><div className="px-5 pt-20 text-center"><CheckCircle2 className="mx-auto size-16 text-mint" /><h1 className="mt-4 text-2xl font-bold">Order confirmed</h1>
      <p className="mt-1 text-xs text-muted-foreground">Order {orderId}</p>
      {paid.hasShipped && <p className="mt-3 text-muted-foreground">Devices ship in 1–3 days. We'll notify you when they ship and when they're out for delivery.</p>}
      {paid.hasEsim && <div className="mt-6 space-y-3"><EsimEmail initial={paid.email} autoSend /><Link to="/esim" className="block h-14 rounded-2xl bg-mint pt-4 font-semibold text-mint-foreground">Activate your eSIM now</Link></div>}
      {paid.hasShipped && <Link to="/orders" className="mt-4 block h-14 rounded-2xl border pt-4 font-semibold text-mint">Track order</Link>}
      <Link to="/" className="mt-3 block text-sm text-muted-foreground">Back home</Link></div></Shell>
  );
  const Line = ({ k, v, cls = "text-muted-foreground" }: { k: string; v: string; cls?: string }) => <div className={"flex justify-between " + cls}><span>{k}</span><span>{v}</span></div>;
  return (
    <Shell>
      <div className="px-5 pt-8"><h1 className="text-3xl font-bold">Shopping Bag</h1><p className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 && "s"}{shipped.items.length > 0 && digital.items.length > 0 && " · 2 deliveries"}</p></div>
      {!cart.length ? <div className="px-5 py-20 text-center text-muted-foreground">Your bag is empty.<Link to="/shop" className="mt-4 block font-semibold text-mint">Start shopping</Link></div> : (
        <div className="space-y-6 px-5 pt-5 pb-28">
          {shipped.items.length > 0 && <section className="rounded-[24px] border p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"><Truck className="size-4" />Shipped devices</p><span className="text-xs text-muted-foreground">1–3 business days</span></div><div className="space-y-3">{shipped.items.map((i) => <Row key={i.key} i={i} />)}</div>
            <div className="mt-3 space-y-2 rounded-[20px] bg-card p-4"><p className="text-sm font-semibold">Delivery details</p>
              {([["name", "Recipient name"], ["street", "Street address"], ["town", "Town"], ["phone", "Contact number"]] as const).map(([k, ph]) => <input key={k} aria-label={ph} placeholder={ph} value={addr[k]} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} className="h-11 w-full rounded-xl bg-surface-2 px-3 text-sm outline-none" />)}
            </div>
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Devices" v={nad(shipped.sub)} />{shipped.disc > 0 && <Line k="Discount" v={"-" + nad(shipped.disc)} cls="text-mint" />}<Line k="Shipping" v={nad(shipped.ship)} /><Line k="Shipped subtotal" v={nad(shipped.total)} cls="font-semibold" /></div>
          </section>}
          {digital.items.length > 0 && <section className="rounded-[24px] border border-mint/40 p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mint"><Wifi className="size-4" />Digital · eSIM & bundles</p><span className="text-xs text-mint">Instant · no shipping</span></div><div className="space-y-3">{digital.items.map((i) => <Row key={i.key} i={i} />)}</div>
            {digital.hasEsim && <div className="mt-3 rounded-[20px] bg-card p-4"><p className="text-sm font-semibold">eSIM delivery email</p><input type="email" aria-label="eSIM delivery email" placeholder="you@example.com" value={esimEmail} onChange={(e) => setEsimEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl bg-surface-2 px-3 text-sm outline-none" /><p className="mt-2 text-xs text-muted-foreground">QR and activation code also show on screen right after payment.</p></div>}
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Digital items" v={nad(digital.sub)} />{digital.disc > 0 && <Line k="Discount" v={"-" + nad(digital.disc)} cls="text-mint" />}<Line k="Delivery" v="N$0" /><Line k="Digital subtotal" v={nad(digital.total)} cls="font-semibold" /></div>
          </section>}
          <section className="rounded-[20px] bg-card p-4">
            <div className="flex gap-2"><label className="flex flex-1 items-center gap-2 rounded-2xl bg-surface-2 px-3"><Tag className="size-4 text-muted-foreground" />
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Promo code (try MTC10)" className="h-11 flex-1 bg-transparent text-sm outline-none" /></label>
              <button onClick={() => { if (code === "MTC10") { setPromo(0.1); setErr(""); } else { setPromo(null); setErr("Invalid code"); } }} className="rounded-2xl bg-mint px-5 text-sm font-bold text-mint-foreground">Apply</button></div>
            {err && <p className="mt-2 text-xs text-primary">{err}</p>}{promo && <p className="mt-2 text-xs text-mint">MTC10 applied — 10% off</p>}
          </section>
          <section className="space-y-2 rounded-[20px] bg-card p-4 text-sm">
            {shipped.items.length > 0 && <Line k="Shipped devices" v={nad(shipped.total)} />}
            {digital.items.length > 0 && <Line k="Digital services" v={nad(digital.total)} />}
            <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{nad(s.total)}</span></div>
          </section>
          {!user && <p className="text-center text-xs text-muted-foreground">Checking out as guest — sign in to keep your order history.</p>}
          {s.errors.length > 0 && (tried || cart.length > 0) && <ul role="alert" className="space-y-1 rounded-[20px] border border-primary/40 bg-primary/10 p-4 text-sm">{s.errors.map((e) => <li key={e}>• {e}</li>)}{!kycDone && cart.some((i) => i.mode === "contract") && <li><Link to="/kyc" className="font-semibold text-mint">Verify now →</Link></li>}</ul>}
        </div>
      )}
      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md gap-2 px-4">
          <button onClick={pay} className={"h-14 flex-1 rounded-2xl bg-primary font-semibold text-primary-foreground glow-red " + (s.errors.length ? "opacity-50" : "")}>Pay Now · {nad(s.total)}</button>
          <button onClick={pay} className={"h-14 rounded-2xl bg-foreground px-5 font-semibold text-background " + (s.errors.length ? "opacity-50" : "")}>Apple Pay</button>
        </div>
      )}
    </Shell>
  );
}
