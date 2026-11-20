import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Share2, Check, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { getProduct, nad, plansFor, quote, stockLabel, TERMS, MTC_STORES, fromMonthly, CONNECTION_FEE } from "@/lib/data";
import { ContractBreakdown } from "@/components/ContractBreakdown";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => { const p = getProduct(params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => ({ meta: [{ title: (loaderData?.name ?? "Device") + " — MTC Store" }, { name: "description", content: loaderData?.tagline ?? "Device details" }, { property: "og:title", content: (loaderData?.name ?? "Device") + " — MTC Store" }, { property: "og:description", content: loaderData?.tagline ?? "Device details" }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : [])] }),
  component: PDP,
});
function PDP() {
  const p = Route.useLoaderData();
  const router = useRouter();
  const { mode, setMode, add, saved, toggleSave, kycDone, viewProduct } = useStore();
  useEffect(() => { viewProduct(p.id); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [months, setMonths] = useState<number>(24);
  const [upPct, setUpPct] = useState(0);
  const [slide, setSlide] = useState(0);
  const imgs = [p.image, ...(p.gallery ?? [])];
  const st = stockLabel(p);
  const [tab, setTab] = useState<"overview" | "plans">("overview");
  const [color, setColor] = useState(p.colors[0]!);
  const avail = plansFor(p);
  const [plan, setPlan] = useState<string>(avail[0]!.id);
  const [added, setAdded] = useState(false);
  const sel = avail.find((x) => x.id === plan) ?? avail[0]!;
  const contract = mode === "contract" && p.contractable;
  const opt = { months, upfrontPct: upPct };
  const q = quote(p, sel, opt);
  const price = contract ? q.monthly : p.cash;
  return (
    <Shell nav={false}>
      <div className="relative">
        <div onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar flex h-[380px] snap-x snap-mandatory overflow-x-auto">
          {imgs.map((src, i) => <img key={src} src={src} alt={`${p.name} photo ${i + 1}`} className="h-full w-full shrink-0 snap-center bg-stage object-contain p-10 pt-20" />)}
        </div>
                {imgs.length > 1 && <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">{imgs.map((_, i) => <span key={i} className={"h-1.5 rounded-full transition-all " + (i === slide ? "w-6 bg-mint" : "w-1.5 bg-foreground/40")} />)}</div>}
        <button aria-label="Back" onClick={() => router.history.back()} className="absolute left-5 top-6 grid size-11 place-items-center rounded-full bg-background/60 backdrop-blur"><ArrowLeft className="size-5" /></button>
        <button aria-label="Share" onClick={() => navigator.share?.({ title: p.name, url: location.href }).catch(() => {})} className="absolute right-5 top-6 grid size-11 place-items-center rounded-full bg-background/60 backdrop-blur"><Share2 className="size-5" /></button>
      </div>
      <div className="relative px-5 pb-36 pt-6">
        <p className="text-xs uppercase tracking-widest text-mint">{p.category}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold leading-tight">{p.name}</h1>
          <span className="shrink-0 rounded-full bg-mint px-4 py-2 text-sm font-bold text-mint-foreground">{nad(price)}{contract && "/mo"}</span>
        </div>
        <p className="mt-1 text-muted-foreground">{p.tagline}</p>
        <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs leading-5 text-muted-foreground">Pocket Market concept preview. Contract instalments are indicative and require official MTC confirmation before application or payment.</p>
        <p className={"mt-2 text-xs font-medium " + (st.tone === "ok" ? "text-mint" : st.tone === "low" ? "text-warning" : "text-primary")}>● {st.text}</p>
        {p.contractable && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => { setMode("cash"); setTab("overview"); }} className={"rounded-[20px] border p-3 text-left " + (!contract ? "border-mint bg-card" : "bg-card/50")}><p className="text-[11px] uppercase tracking-widest text-muted-foreground">Buy outright</p><p className="mt-1 text-lg font-bold">{nad(p.cash)}</p><p className="text-[11px] text-muted-foreground">Pay once</p></button>
            <button onClick={() => { setMode("contract"); setTab("plans"); }} className={"rounded-[20px] border p-3 text-left " + (contract ? "border-mint bg-card" : "bg-card/50")}><p className="text-[11px] uppercase tracking-widest text-muted-foreground">On contract</p><p className="mt-1 text-lg font-bold">from {nad(fromMonthly(p))}<span className="text-xs font-normal">/mo</span></p><p className="text-[11px] text-muted-foreground">+ {nad(CONNECTION_FEE)} connection fee</p></button>
          </div>)}
        {p.category === "Laptops" && <Link to="/compare/macbooks" className="mt-3 block rounded-[20px] bg-surface-2 p-3 text-sm">Compare all MacBooks: outright vs Select plans <span className="text-mint">→</span></Link>}
        <details className="mt-3 rounded-[20px] bg-card shadow-card p-3 text-sm"><summary className="cursor-pointer font-semibold">View potential collection locations</summary><p className="mt-2 text-xs leading-5 text-muted-foreground">These branch names come from the published collection list. Inventory and reservation availability have not been verified.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{MTC_STORES.join(" · ")}</p></details>
        <div className="mt-4 flex items-center justify-between">{!p.contractable && <span className="rounded-full bg-card px-3 py-1.5 text-xs text-muted-foreground">Cash purchase only</span>}
          {p.colors.length > 1 && <div className="flex gap-2">{p.colors.map((c) => <button key={c} onClick={() => setColor(c)} className={"rounded-full border px-3 py-1 text-xs " + (color === c ? "border-mint text-mint" : "text-muted-foreground")}>{c}</button>)}</div>}
        </div>
        {p.contractable && <div className="mt-6 grid grid-cols-2 rounded-full bg-card p-1 text-xs font-bold tracking-widest">
          {(["overview", "plans"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={"rounded-full py-3 uppercase " + (tab === t ? "bg-mint text-mint-foreground" : "text-muted-foreground")}>{t}</button>)}
        </div>}
        {contract && tab === "overview" && <div className="mt-4"><ContractBreakdown p={p} plan={sel} opt={opt} /></div>}
        {tab === "overview" ? (<>
          <div className="mt-4 flex items-center justify-between text-xs"><span className="text-muted-foreground">Specs and cash price as listed by MTC</span><a href={p.source} target="_blank" rel="noreferrer" className="font-semibold text-mint">View on mtc.com.na ↗</a></div>
          <div className="mt-3 grid grid-cols-2 gap-3">{p.specs.map((s) => <div key={s.label} className="rounded-[20px] bg-card shadow-card p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-1 text-lg font-bold">{s.value}</p></div>)}</div>
        </>) : (
          <div className="mt-4 space-y-3">
            {avail.map((pl) => (
              <button key={pl.id} onClick={() => setPlan(pl.id)} className={"flex w-full items-center justify-between rounded-[20px] border bg-card p-4 text-left " + (plan === pl.id ? "border-mint" : "")}>
                <div><p className="font-semibold">{pl.name}</p><p className="text-xs text-muted-foreground">{pl.data} · {pl.mins} · {pl.sms}</p></div>
                <p className="font-bold">{nad(quote(p, pl, opt).monthly)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </button>
            ))}
            <div className="space-y-4 rounded-[20px] bg-card shadow-card p-4 text-sm">
              <div><p className="mb-2 text-xs text-muted-foreground">Contract term</p><div className="grid grid-cols-4 gap-2">{TERMS.filter((m) => (sel.terms as readonly number[]).includes(m)).map((m) => <button key={m} onClick={() => setMonths(m)} className={"rounded-xl py-2 font-semibold " + (months === m ? "bg-mint text-mint-foreground" : "bg-surface-2 text-muted-foreground")}>{m} mo</button>)}</div></div>
              <label className="block text-xs text-muted-foreground">Upfront payment: <span className="text-foreground">{nad(q.upfront)} ({Math.round(upPct * 100)}%)</span>
                <input aria-label="Upfront payment" type="range" min={0} max={0.5} step={0.05} value={upPct} onChange={(e) => setUpPct(+e.target.value)} className="mt-2 w-full accent-[var(--mint)]" /></label>
            </div>
            <ContractBreakdown p={p} plan={sel} opt={opt} />
            <Link to="/kyc" className="flex items-center gap-3 rounded-[20px] bg-surface-2 p-4 text-sm">
              <ShieldCheck className={kycDone ? "text-mint" : "text-primary"} />
              <span className="flex-1">"Official MTC identity verification is required before applying"</span>
              <span className="font-semibold text-mint">Learn more</span>
            </Link>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md gap-3 border-t bg-background/90 p-4 backdrop-blur-xl">
        <button aria-label="Save" onClick={() => toggleSave(p.id)} className={"grid size-14 place-items-center rounded-2xl bg-card " + (saved.includes(p.id) ? "text-mint" : "")}><Bookmark className="size-5" fill={saved.includes(p.id) ? "currentColor" : "none"} /></button>
        <button onClick={() => { add({ id: p.id, name: p.name, image: p.image, variant: contract ? `${color} · ${sel.name} · ${months} mo · ${sel.data}` + (q.upfront ? ` · ${nad(q.upfront)} upfront` : "") : color, price, kind: "physical", mode: contract ? "contract" : "cash" }); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          disabled={st.tone === "out"} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-primary disabled:opacity-40 font-semibold text-primary-foreground">{st.tone === "out" ? "Out of stock" : added ? <><Check className="size-5" /> Added</> : contract ? "Select plan & add" : "Add to Cart"}</button>
      </div>
    </Shell>
  );
}
