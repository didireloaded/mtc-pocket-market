import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Truck, Wifi, Tag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { nad, products } from "@/lib/data";
import { useStore, type CartItem } from "@/lib/store";
import { summarize, PROMOS, PAYMENT_METHODS, FREE_SHIPPING_OVER, type Address, type PaymentId } from "@/lib/checkout";
import { accessoryIds, getProduct } from "@/lib/data";
const accessories = accessoryIds.map((id) => getProduct(id)!);
import { EsimEmail } from "@/components/EsimEmail";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — MTC Store" }, { name: "description", content: "Review devices and digital services, apply a promo code and check out." }, { property: "og:title", content: "Your Bag — MTC Store" }, { property: "og:description", content: "Review devices and digital services, apply a promo code and check out." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Cart,
});
function Row({ i }: { i: CartItem }) {
  const { setQty, remove } = useStore();
  return (
    <div className="flex gap-3 rounded-[20px] bg-card shadow-card p-3">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-2">{i.image ? <img src={i.image} alt={i.name} className="size-full bg-stage object-contain p-1.5" /> : <Wifi className="text-mint" />}</div>
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
  const { cart, clear, kycDone, placeOrder, user, extra, setExtra, add } = useStore();
  const [payment, setPayment] = useState<PaymentId>("card");
  const [saveAs, setSaveAs] = useState("");
  const [orderId, setOrderId] = useState("");
  const [addr, setAddr] = useState<Address>(() => { const a = extra.addresses[0]; return a ? { name: a.name, street: a.street, town: a.town, phone: a.phone } : { name: "", street: "", town: "", phone: "" }; });
  const [esimEmail, setEsimEmail] = useState(user?.method === "email" ? user.label : "");
  const [code, setCode] = useState(""); const [promo, setPromo] = useState<number | null>(null); const [err, setErr] = useState("");
  const [paid, setPaid] = useState<null | { hasEsim: boolean; hasShipped: boolean; email: string }>(null);
  const [tried, setTried] = useState(false);
  const s = summarize(cart, { promo, addr, kycDone, esimEmail, payment });
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
      {paid.hasEsim && <div className="mt-6 space-y-3"><EsimEmail initial={paid.email} autoSend /><Link to="/esim" className="block h-14 rounded-full bg-mint pt-4 font-semibold text-mint-foreground">Activate your eSIM now</Link></div>}
      {paid.hasShipped && <Link to="/orders" className="mt-4 block h-14 rounded-full border pt-4 font-semibold text-mint">Track order</Link>}
      <Link to="/" className="mt-3 block text-sm text-muted-foreground">Back home</Link></div></Shell>
  );
  const Line = ({ k, v, cls = "text-muted-foreground" }: { k: string; v: string; cls?: string }) => <div className={"flex justify-between " + cls}><span>{k}</span><span>{v}</span></div>;
  return (
    <Shell>
      <div className="px-5 pt-8"><h1 className="text-3xl font-bold">My Bag</h1><p className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 && "s"}{shipped.items.length > 0 && digital.items.length > 0 && " · 2 deliveries"}</p></div>
      {shipped.items.length > 0 && (() => { const got = shipped.sub - shipped.disc; const pct = Math.min(100, (got / FREE_SHIPPING_OVER) * 100); return (
        <div className="mx-5 mt-4 flex items-center gap-4 rounded-[20px] bg-success/10 p-4">
          <Truck className="size-8 shrink-0 text-success" />
          <div className="flex-1"><p className="text-sm font-semibold text-success">{pct >= 100 ? "You've unlocked free delivery!" : `Add ${nad(FREE_SHIPPING_OVER - got)} for free delivery`}</p>
            <div className="mt-2 h-2 rounded-full bg-success/20"><div className="h-full rounded-full bg-success" style={{ width: pct + "%" }} /></div></div>
        </div>); })()}
      {!cart.length ? <div className="px-5 py-20 text-center text-muted-foreground">Your bag is empty.<Link to="/shop" className="mt-4 block font-semibold text-mint">Start shopping</Link></div> : (
        <div className="space-y-6 px-5 pt-5 pb-28">
          {shipped.items.length > 0 && <section className="rounded-[24px] border p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"><Truck className="size-4" />Shipped devices</p><span className="text-xs text-muted-foreground">1–3 business days</span></div><div className="space-y-3">{shipped.items.map((i) => <Row key={i.key} i={i} />)}</div>
            <div className="mt-3 space-y-2 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">Delivery details</p>
              <div className="flex flex-wrap gap-2">{extra.addresses.map((a) => <button key={a.label} onClick={() => setAddr({ name: a.name, street: a.street, town: a.town, phone: a.phone })} className={"rounded-full border px-3 py-1 text-xs " + (a.street === addr.street && a.name === addr.name ? "border-mint text-mint" : "text-muted-foreground")}>{a.label}</button>)}</div>
              {([["name", "Recipient name"], ["street", "Street address"], ["town", "Town"], ["phone", "Contact number"]] as const).map(([k, ph]) => <input key={k} aria-label={ph} placeholder={ph} value={addr[k]} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} className="h-11 w-full rounded-xl bg-surface-2 px-3 text-sm outline-none" />)}
              <div className="flex gap-2"><input aria-label="Save address as" value={saveAs} onChange={(e) => setSaveAs(e.target.value)} placeholder="Save as (e.g. Work)" className="h-9 flex-1 rounded-xl bg-surface-2 px-3 text-xs outline-none" />
                <button disabled={!saveAs.trim() || !addr.street.trim()} onClick={() => { setExtra((e) => ({ ...e, addresses: [...e.addresses.filter((a) => a.label !== saveAs.trim()), { label: saveAs.trim(), ...addr }] })); setSaveAs(""); }} className="rounded-xl border px-3 text-xs font-semibold text-mint disabled:opacity-40">Save</button></div>
            </div>
            {shipped.items.some((i) => products.find((p) => p.id === i.id)?.category === "Phones") && <div className="mt-3 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">Add accessories</p>
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">{accessories.map((a) => { const inCart = cart.some((i) => i.id === a.id); return <button key={a.id} disabled={inCart} onClick={() => add({ id: a.id, name: a.name, image: a.image, variant: "Accessory", price: a.cash, kind: "physical", mode: "cash" })} className="w-32 shrink-0 rounded-xl bg-surface-2 p-2 text-left disabled:opacity-50"><img src={a.image} alt={a.name} className="h-16 w-full rounded-lg bg-stage object-contain p-1" /><p className="mt-1 truncate text-xs font-medium">{a.name}</p><p className="text-xs"><span className="font-bold">{nad(a.cash)}</span></p><p className="text-[10px] text-mint">{inCart ? "Added" : "+ Add"}</p></button>; })}</div></div>}
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Devices" v={nad(shipped.sub)} />{shipped.disc > 0 && <Line k="Discount" v={"-" + nad(shipped.disc)} cls="text-mint" />}<Line k="Shipping" v={shipped.ship ? nad(shipped.ship) : "Free"} />{shipped.ship > 0 && <p className="text-xs text-mint">Add {nad(FREE_SHIPPING_OVER - (shipped.sub - shipped.disc))} more for free shipping</p>}<Line k="Shipped subtotal" v={nad(shipped.total)} cls="font-semibold" /></div>
          </section>}
          {digital.items.length > 0 && <section className="rounded-[24px] border border-mint/40 p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mint"><Wifi className="size-4" />Digital · eSIM & bundles</p><span className="text-xs text-mint">Instant · no shipping</span></div><div className="space-y-3">{digital.items.map((i) => <Row key={i.key} i={i} />)}</div>
            {digital.hasEsim && <div className="mt-3 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">eSIM delivery email</p><input type="email" aria-label="eSIM delivery email" placeholder="you@example.com" value={esimEmail} onChange={(e) => setEsimEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl bg-surface-2 px-3 text-sm outline-none" /><p className="mt-2 text-xs text-muted-foreground">QR and activation code also show on screen right after payment.</p></div>}
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Digital items" v={nad(digital.sub)} />{digital.disc > 0 && <Line k="Discount" v={"-" + nad(digital.disc)} cls="text-mint" />}<Line k="Delivery" v="N$0" /><Line k="Digital subtotal" v={nad(digital.total)} cls="font-semibold" /></div>
          </section>}
          <section className="rounded-[20px] bg-card shadow-card p-4">
            <div className="flex gap-2"><label className="flex flex-1 items-center gap-2 rounded-2xl bg-surface-2 px-3"><Tag className="size-4 text-muted-foreground" />
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Promo code (try MTCSUMMER)" className="h-11 flex-1 bg-transparent text-sm outline-none" /></label>
              <button onClick={() => { if (PROMOS[code]) { setPromo(PROMOS[code]!); setErr(""); } else { setPromo(null); setErr("Invalid code"); } }} className="rounded-2xl bg-mint px-5 text-sm font-bold text-mint-foreground">Apply</button></div>
            {err && <p className="mt-2 text-xs text-primary">{err}</p>}{promo && <p className="mt-2 text-xs text-mint">{code} applied — {Math.round(promo * 100)}% off</p>}
          </section>
          <section className="space-y-2 rounded-[20px] bg-card shadow-card p-4 text-sm">
            {shipped.items.length > 0 && <Line k="Shipped devices" v={nad(shipped.total)} />}
            {digital.items.length > 0 && <Line k="Digital services" v={nad(digital.total)} />}
            <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{nad(s.total)}</span></div>
          </section>
          <section className="rounded-[20px] bg-card shadow-card p-4"><p className="mb-2 text-sm font-semibold">Payment method</p>
            <div className="space-y-2">{PAYMENT_METHODS.map((m) => <label key={m.id} className={"flex cursor-pointer items-center gap-3 rounded-xl border p-3 " + (payment === m.id ? "border-mint" : "")}><input type="radio" name="pay" checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-[var(--mint)]" /><div><p className="text-sm font-medium">{m.label}</p><p className="text-xs text-muted-foreground">{m.hint}</p></div></label>)}</div>
          </section>
          {!user && <p className="text-center text-xs text-muted-foreground">Checking out as guest — sign in to keep your order history.</p>}
          {s.errors.length > 0 && (tried || cart.length > 0) && <ul role="alert" className="space-y-1 rounded-[20px] border border-primary/40 bg-primary/10 p-4 text-sm">{s.errors.map((e) => <li key={e}>• {e}</li>)}{!kycDone && cart.some((i) => i.mode === "contract") && <li><Link to="/kyc" className="font-semibold text-mint">Verify now →</Link></li>}</ul>}
        </div>
      )}
      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md gap-2 px-4">
          <button onClick={pay} className={"h-14 flex-1 rounded-full bg-primary font-semibold text-primary-foreground " + (s.errors.length ? "opacity-50" : "")}>Pay Now · {nad(s.total)}</button>
          <button onClick={pay} className={"h-14 rounded-full bg-foreground px-5 font-semibold text-background " + (s.errors.length ? "opacity-50" : "")}>Apple Pay</button>
        </div>
      )}
    </Shell>
  );
}
