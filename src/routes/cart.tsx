import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Truck, Wifi, CheckCircle2, CreditCard, Building2, Wallet, Info } from "lucide-react";
import { useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { nad, products } from "@/lib/data";
import { useStore, type CartItem } from "@/lib/store";
import { summarize, PAYMENT_METHODS, type Address } from "@/lib/checkout";
import { accessoryIds, getProduct } from "@/lib/data";
import { CloudOrderRequest } from "@/components/CloudOrderRequest";
import { NamibiaAddressFields } from "@/components/NamibiaAddressFields";
const accessories = accessoryIds.map((id) => getProduct(id)!);


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
          <button type="button" aria-label={`Remove ${i.name}`} onClick={() => remove(i.key)} className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-primary"><Trash2 className="size-5" /></button></div>
        <p className="truncate text-xs text-muted-foreground">{i.variant}{i.mode === "contract" && " · contract"}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-bold">{nad(i.price * i.qty)}{i.mode === "contract" && <span className="text-xs font-normal text-muted-foreground">/mo</span>}</p>
          <div className="flex items-center gap-1 rounded-full bg-surface-2 px-1">
            <button type="button" aria-label={`Decrease quantity of ${i.name}`} onClick={() => setQty(i.key, i.qty - 1)} className="grid size-11 place-items-center rounded-full"><Minus className="size-4" /></button>
            <span aria-label={`Quantity ${i.qty}`} className="min-w-5 text-center text-[14px] font-semibold tabular-nums">{i.qty}</span>
            <button type="button" aria-label={`Increase quantity of ${i.name}`} onClick={() => setQty(i.key, i.qty + 1)} className="grid size-11 place-items-center rounded-full"><Plus className="size-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Cart() {
  const { cart, clear, kycDone, placeOrder, user, extra, setExtra, add } = useStore();
  const submittedRef = useRef(false);
  const [saveAs, setSaveAs] = useState("");
  const [orderId, setOrderId] = useState("");
  const [addr, setAddr] = useState<Address>(() => { const a = extra.addresses[0]; return a ? { name: a.name, street: a.street, town: a.town, region: a.region ?? "", phone: a.phone } : { name: "", street: "", town: "", region: "", phone: "" }; });
  const [esimEmail, setEsimEmail] = useState(user?.method === "email" ? user.label : "");
  const [paid, setPaid] = useState<null | { hasEsim: boolean; hasShipped: boolean; email: string }>(null);
  const [tried, setTried] = useState(false);
  const s = summarize(cart, { promo: null, addr, kycDone, esimEmail });
  const { shipped, digital } = s;
  const pay = () => {
    setTried(true);
    if (s.errors.length || submittedRef.current) return;
    submittedRef.current = true;
    setOrderId(placeOrder({ items: cart.map((i) => ({ name: i.name, qty: i.qty, kind: i.kind })), total: s.total, shippedTotal: shipped.total, digitalTotal: digital.total, esimEmail, address: shipped.items.length ? `${addr.street}, ${addr.town}, ${addr.region}` : "" }));
    setPaid({ hasEsim: digital.hasEsim, hasShipped: shipped.items.length > 0, email: esimEmail }); clear();
  };
  if (paid) return (
    <Shell><div className="px-5 pt-20 text-center"><CheckCircle2 className="mx-auto size-16 text-mint" /><h1 className="mt-4 text-2xl font-bold">Shopping preview saved</h1>
      <p className="mt-1 text-xs text-muted-foreground">Local reference {orderId}. No payment was made or MTC order submitted.</p>
      {paid.hasShipped && <p className="mt-3 text-muted-foreground">This is a demonstration order saved in this browser. No real delivery or fulfilment has been requested.</p>}
      {paid.hasEsim && <div className="mt-6 space-y-3"><p className="rounded-2xl bg-card p-4 text-xs leading-5 text-muted-foreground">No activation email has been sent. Digital fulfilment requires a live MTC integration.</p><Link to="/esim" className="block h-14 rounded-full bg-mint pt-4 font-semibold text-mint-foreground">Learn about eSIM activation</Link></div>}
      {paid.hasShipped && <Link to="/orders" className="mt-4 block h-14 rounded-full border pt-4 font-semibold text-mint">View demo history</Link>}
      <Link to="/" className="mt-3 block text-sm text-muted-foreground">Back home</Link></div></Shell>
  );
  const Line = ({ k, v, cls = "text-muted-foreground" }: { k: string; v: string; cls?: string }) => <div className={"flex justify-between " + cls}><span>{k}</span><span>{v}</span></div>;
  return (
    <Shell>
      <div className="px-5 pt-8"><h1 className="text-3xl font-bold">Your bag</h1><p className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 && "s"}{shipped.items.length > 0 && digital.items.length > 0 && " · physical and digital items"}</p><CloudOrderRequest /></div>
      {!cart.length ? <div className="px-5 py-20 text-center text-muted-foreground">Your bag is empty.<Link to="/shop" className="mt-4 block font-semibold text-mint">Start shopping</Link></div> : (
        <div className="space-y-6 px-5 pt-5 pb-6">
          {shipped.items.length > 0 && <section className="rounded-[24px] border p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"><Truck className="size-4" />Physical devices</p><span className="text-xs text-muted-foreground">Delivery not arranged</span></div><div className="space-y-3">{shipped.items.map((i) => <Row key={i.key} i={i} />)}</div>
            <div className="mt-3 space-y-2 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">Delivery details</p>
              <div className="flex flex-wrap gap-2">{extra.addresses.map((a) => <button key={a.label} onClick={() => setAddr({ name: a.name, street: a.street, town: a.town, region: a.region ?? "", phone: a.phone })} className={"rounded-full border px-3 py-1 text-xs " + (a.street === addr.street && a.name === addr.name ? "border-mint text-mint" : "text-muted-foreground")}>{a.label}</button>)}</div>
              <NamibiaAddressFields prefix="bag" value={addr} onChange={setAddr} />
              <div className="flex gap-2"><input aria-label="Save address as" value={saveAs} onChange={(e) => setSaveAs(e.target.value)} placeholder="Save this address as (e.g. Work)" className="h-12 min-w-0 flex-1 rounded-xl bg-surface-2 px-3 text-[16px] outline-none" />
                <button disabled={!saveAs.trim() || !addr.street.trim() || !addr.town.trim() || !addr.region} onClick={() => { setExtra((e) => ({ ...e, addresses: [...e.addresses.filter((a) => a.label !== saveAs.trim()), { label: saveAs.trim(), ...addr }] })); setSaveAs(""); }} className="min-h-12 rounded-xl border px-4 text-[14px] font-semibold text-mint disabled:opacity-40">Save</button></div>
            </div>
            {shipped.items.some((i) => products.find((p) => p.id === i.id)?.category === "Phones") && <div className="mt-3 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">Add accessories</p>
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">{accessories.map((a) => { const inCart = cart.some((i) => i.id === a.id); return <button key={a.id} disabled={inCart} onClick={() => add({ id: a.id, name: a.name, image: a.image, variant: "Accessory", price: a.cash, kind: "physical", mode: "cash" })} className="w-32 shrink-0 rounded-xl bg-surface-2 p-2 text-left disabled:opacity-50"><img src={a.image} alt={a.name} className="h-16 w-full rounded-lg bg-stage object-contain p-1" /><p className="mt-1 truncate text-xs font-medium">{a.name}</p><p className="text-xs"><span className="font-bold">{nad(a.cash)}</span></p><p className="text-[10px] text-mint">{inCart ? "Added" : "+ Add"}</p></button>; })}</div></div>}
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Devices" v={nad(shipped.sub)} />{shipped.disc > 0 && <Line k="Discount" v={"-" + nad(shipped.disc)} cls="text-mint" />}<Line k="Delivery fee" v="To be confirmed" /><p className="text-xs leading-5 text-muted-foreground">No delivery fee is included. An actual fee requires official confirmation.</p><Line k="Physical items subtotal" v={nad(shipped.total)} cls="font-semibold" /></div>
          </section>}
          {digital.items.length > 0 && <section className="rounded-[24px] border border-mint/40 p-3"><div className="mb-3 flex items-center justify-between px-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mint"><Wifi className="size-4" />Digital · eSIM & bundles</p><span className="text-xs text-mint">Activation not connected</span></div><div className="space-y-3">{digital.items.map((i) => <Row key={i.key} i={i} />)}</div>
            {digital.hasEsim && <div className="mt-3 rounded-[20px] bg-card shadow-card p-4"><p className="text-sm font-semibold">eSIM delivery email</p><input type="email" inputMode="email" autoComplete="email" aria-label="Email for eSIM demonstration" placeholder="you@example.com" value={esimEmail} onChange={(e) => setEsimEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl bg-surface-2 px-3 text-[16px] outline-none" /><p className="mt-2 text-xs text-muted-foreground">An activation email or QR code cannot be issued until an approved service is connected.</p></div>}
            <div className="mt-3 space-y-1 px-1 text-sm"><Line k="Digital items" v={nad(digital.sub)} />{digital.disc > 0 && <Line k="Discount" v={"-" + nad(digital.disc)} cls="text-mint" />}<Line k="Delivery" v="N$0" /><Line k="Digital subtotal" v={nad(digital.total)} cls="font-semibold" /></div>
          </section>}
          <section className="space-y-2 rounded-[20px] bg-card shadow-card p-4 text-sm">
            {shipped.items.length > 0 && <Line k="Physical items" v={nad(shipped.total)} />}
            {digital.items.length > 0 && <Line k="Digital services" v={nad(digital.total)} />}
            {s.recurringMonthly > 0 && <div className="flex justify-between gap-3 text-sm text-muted-foreground"><span>Estimated contract payments (not charged now)</span><span>{nad(s.recurringMonthly)}/month</span></div>}
            <div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Items subtotal</span><span>{nad(s.total)}</span></div>
          </section>
          <section className="rounded-[22px] bg-[#151C23] p-5 text-white">
            <h2 className="text-[18px] font-semibold">Payment options</h2>
            <p className="mt-2 text-[13px] leading-5 text-[#BAC5CE]">
              Payments will be available only after an approved checkout integration. You cannot pay or reserve stock here yet.
            </p>
            <div className="mt-5 space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.id === "card" ? CreditCard : method.id === "eft" ? Building2 : Wallet;
                return <div key={method.id} className="flex min-h-[73px] items-center gap-3 rounded-[17px] border border-white/10 bg-[#202E39] p-3" aria-disabled="true">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-[#E15D51]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{method.label}</p>
                    <p className="mt-1 text-[12px] leading-4 text-[#BAC5CE]">{method.hint}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-medium text-[#BAC5CE]">Unavailable</span>
                </div>;
              })}
            </div>
          </section>
          <p className="flex items-start gap-2 rounded-[17px] border border-[#BACAD4] bg-[#E9F1F6] p-4 text-[13px] leading-5 text-[#254B63]">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Independent retail concept. Saving a shopping preview does not place an MTC order, collect payment, reserve stock, arrange delivery or activate an eSIM.
          </p>
          {!user && <p className="text-center text-xs text-muted-foreground">Guest demo orders stay in this browser. Sign in does not sync them to MTC.</p>}
          {s.errors.length > 0 && tried && <ul role="alert" className="space-y-1 rounded-[20px] border border-primary/40 bg-primary/10 p-4 text-sm">{s.errors.map((e) => <li key={e}>• {e}</li>)}{!kycDone && cart.some((i) => i.mode === "contract") && <li><Link to="/kyc" className="font-semibold text-mint">Review verification requirements →</Link></li>}</ul>}
        </div>
      )}
      {cart.length > 0 && (
        <div className="px-5 pb-9 pt-2">
          <button type="button" onClick={pay}
            className="min-h-14 w-full rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground focus-visible:outline-offset-4">
            Save shopping preview · {nad(s.total)}
          </button>
          <p className="mt-3 text-center text-[12px] leading-5 text-muted-foreground">This does not submit an MTC order, collect payment or reserve stock.</p>
        </div>
      )}
    </Shell>
  );
}
