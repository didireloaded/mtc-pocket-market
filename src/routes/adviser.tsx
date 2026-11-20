import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, LoaderCircle, MessageCircle, Send, Wifi } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProductStage } from "@/components/retail/RetailPrimitives";
import { getProduct, nad, plans, quote } from "@/lib/data";
import { recommendShopping } from "@/lib/adviser.functions";
import type { Advice } from "@/lib/adviser";

export const Route = createFileRoute("/adviser")({
  head: () => ({ meta: [
    { title: "Shopping Adviser — MTC Pocket Market" },
    { name: "description", content: "Find MTC catalog devices, accessories and contract plans suited to your needs and budget." },
    { property: "og:title", content: "MTC Pocket Market Shopping Adviser" },
    { property: "og:description", content: "Personalised device and plan recommendations from the store catalog." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ShoppingAdviser,
});

const examples = [
  { label: "Study & work", needs: "I need a lightweight laptop for university and video calls, plus a data plan. My outright laptop budget is N$15,000." },
  { label: "Home internet", needs: "I need an affordable portable Wi-Fi device for working away from home, under N$1,000 outright." },
  { label: "Music & calls", needs: "I want wireless earphones for music and calls, with an outright budget of N$700." },
];

function ShoppingAdviser() {
  const [needs, setNeeds] = useState("");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const recommend = useServerFn(recommendShopping);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || needs.trim().length < 10) return;
    setBusy(true); setError(""); setAdvice(null);
    try {
      const result = await recommend({ data: { needs: needs.trim() } });
      if (result.advice) setAdvice(result.advice);
      else setError(result.error);
    } catch {
      setError("The adviser is unavailable right now. Your description is still here; please try again later.");
    } finally { setBusy(false); }
  }
  return <Shell>
    <main className="px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="secondary" size="icon" className="size-11 rounded-full"><Link to="/" aria-label="Back to Home"><ArrowLeft /></Link></Button>
        <span className="flex items-center gap-2 text-sm font-semibold text-mint"><MessageCircle className="size-4" />AI shopping adviser</span>
      </div>
      <header className="mb-7 mt-8">
        <h1 className="text-3xl font-bold leading-tight">What’s your next connection?</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">A device for work. Better sound. A plan that fits your day.</p>
      </header>
      <form onSubmit={submit} className="space-y-4">
        <label htmlFor="shopping-needs" className="block text-sm font-semibold">Your needs & budget</label>
        <Textarea id="shopping-needs" value={needs} onChange={(e) => setNeeds(e.target.value)} maxLength={1500} minLength={10} required disabled={busy}
          placeholder="I need a laptop for studying, with a budget of N$15,000…" className="min-h-36 resize-y rounded-lg bg-card p-4 text-base leading-6 shadow-none" />
        <div className="flex flex-wrap gap-2">{examples.map((example) => <Button key={example.label} type="button" variant="outline" disabled={busy} onClick={() => setNeeds(example.needs)} className="rounded-full text-xs">{example.label}</Button>)}</div>
        <p className="text-xs leading-5 text-muted-foreground">AI suggestions can be imperfect. Stock and final contract costs need MTC confirmation. Avoid sharing personal account details.</p>
        <Button type="submit" disabled={busy || needs.trim().length < 10} className="h-12 w-full rounded-full">
          {busy ? <><LoaderCircle className="animate-spin motion-reduce:animate-none" />Finding your matches…</> : <>Find my matches <Send /></>}
        </Button>
      </form>
      <div aria-live="polite" aria-busy={busy} className="mt-6">
        {busy && <p role="status" className="text-sm text-muted-foreground">Considering devices, accessories and plans from the catalog…</p>}
        {error && <div role="alert" className="rounded-lg border border-brand-red/30 bg-card p-4 text-sm leading-6 text-brand-red">{error}</div>}
        {advice && <>
          <h2 className="text-xl font-bold">Your shortlist</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{advice.summary}</p>
          <div className="mt-5 space-y-4">{advice.products.map((item) => {
            const product = getProduct(item.id);
            if (!product) return null;
            return <article key={item.id} className="rounded-lg border bg-card p-4">
              <div className="flex gap-4"><ProductStage src={product.image} alt={product.name} className="size-24 shrink-0 rounded-lg p-2" />
                <div className="min-w-0"><p className="text-xs font-semibold text-mint">{product.category}</p><h3 className="mt-1 text-base font-bold leading-5">{product.name}</h3><p className="mt-2 text-sm font-semibold">{nad(product.cash)} <span className="font-normal text-muted-foreground">outright</span></p></div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.reason}</p>
              <Button asChild variant="secondary" className="mt-3 h-11 w-full rounded-full"><Link to="/product/$id" params={{ id: product.id }}>Explore device <ArrowUpRight /></Link></Button>
            </article>;
          })}</div>
          {advice.plans.length > 0 && <section className="mt-7"><h2 className="text-xl font-bold">Plans to consider</h2><div className="mt-4 space-y-4">{advice.plans.map((item) => {
            const plan = plans.find((p) => p.id === item.id);
            if (!plan) return null;
            const product = item.productId ? getProduct(item.productId) : undefined;
            const estimate = product ? quote(product, plan, { months: 24, upfrontPct: 0 }) : null;
            return <article key={`${item.id}-${item.productId}`} className="rounded-lg border bg-card p-4">
              <h3 className="flex items-center gap-2 font-bold"><Wifi className="size-4 text-mint" />{plan.name}</h3>
              <p className="mt-2 text-lg font-bold">{nad(plan.fee)}<span className="text-sm font-normal text-muted-foreground"> / month · plan only</span></p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.data} · {plan.mins} · {plan.sms}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.reason}</p>
              {estimate && product && <div className="mt-3 border-t pt-3 text-sm leading-6"><p className="font-semibold">With {product.name}</p><p>Estimated {nad(estimate.monthly)}/mo for {estimate.months} months</p><p className="text-muted-foreground">Device {nad(estimate.device)} + plan {nad(estimate.fee)}/mo</p><p className="text-muted-foreground">Due today: {nad(estimate.upfront + estimate.connection)} including connection fee</p></div>}
              <Button asChild variant="secondary" className="mt-3 h-11 w-full rounded-full">{product ? <Link to="/product/$id" params={{ id: product.id }}>Explore contract options <ArrowUpRight /></Link> : <a href="https://www.mtc.com.na/contract" target="_blank" rel="noopener noreferrer">Check plan with MTC <ArrowUpRight /></a>}</Button>
            </article>;
          })}</div></section>}
          {!advice.products.length && !advice.plans.length && <Button asChild variant="secondary" className="mt-4 rounded-full"><Link to="/shop">Browse the catalog <ArrowUpRight /></Link></Button>}
        </>}
      </div>
    </main>
  </Shell>;
}