import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Share2, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Shell, PriceToggle } from "@/components/Shell";
import { getProduct, nad, plans, quote } from "@/lib/data";
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
  const { mode, add, saved, toggleSave, kycDone } = useStore();
  const [tab, setTab] = useState<"overview" | "plans">("overview");
  const [color, setColor] = useState(p.colors[0]!);
  const [plan, setPlan] = useState(plans[0]!.id);
  const [added, setAdded] = useState(false);
  const sel = plans.find((x) => x.id === plan)!;
  const q = quote(p, sel);
  const price = mode === "cash" ? p.cash : q.monthly;
  return (
    <Shell nav={false}>
      <div className="relative">
        <img src={p.image} alt={p.name} className="h-[420px] w-full object-cover" />
        <div className="absolute inset-0 fade-bottom" />
        <button aria-label="Back" onClick={() => router.history.back()} className="absolute left-5 top-6 grid size-11 place-items-center rounded-full bg-background/60 backdrop-blur"><ArrowLeft className="size-5" /></button>
        <button aria-label="Share" onClick={() => navigator.share?.({ title: p.name, url: location.href }).catch(() => {})} className="absolute right-5 top-6 grid size-11 place-items-center rounded-full bg-background/60 backdrop-blur"><Share2 className="size-5" /></button>
      </div>
      <div className="-mt-10 relative px-5 pb-36">
        <p className="text-xs uppercase tracking-widest text-mint">{p.category}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold leading-tight">{p.name}</h1>
          <span className="shrink-0 rounded-full bg-mint px-4 py-2 text-sm font-bold text-mint-foreground">{nad(price)}{mode === "contract" && "/mo"}</span>
        </div>
        <p className="mt-1 text-muted-foreground">{p.tagline}</p>
        <div className="mt-4 flex items-center justify-between"><PriceToggle />
          <div className="flex gap-2">{p.colors.map((c) => <button key={c} onClick={() => setColor(c)} className={"rounded-full border px-3 py-1 text-xs " + (color === c ? "border-mint text-mint" : "text-muted-foreground")}>{c}</button>)}</div>
        </div>
        <div className="mt-6 grid grid-cols-2 rounded-full bg-card p-1 text-xs font-bold tracking-widest">
          {(["overview", "plans"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={"rounded-full py-3 uppercase " + (tab === t ? "bg-mint text-mint-foreground" : "text-muted-foreground")}>{t}</button>)}
        </div>
        {mode === "contract" && tab === "overview" && <div className="mt-4"><ContractBreakdown p={p} plan={sel} /></div>}
        {tab === "overview" ? (
          <div className="mt-4 grid grid-cols-2 gap-3">{p.specs.map((s) => <div key={s.label} className="rounded-[20px] bg-card p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-1 text-lg font-bold">{s.value}</p></div>)}</div>
        ) : (
          <div className="mt-4 space-y-3">
            {plans.map((pl) => (
              <button key={pl.id} onClick={() => setPlan(pl.id)} className={"flex w-full items-center justify-between rounded-[20px] border bg-card p-4 text-left " + (plan === pl.id ? "border-mint" : "")}>
                <div><p className="font-semibold">{pl.name}</p><p className="text-xs text-muted-foreground">{pl.data} · {pl.mins} · {pl.sms}</p></div>
                <p className="font-bold">{nad(quote(p, pl).monthly)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </button>
            ))}
            <ContractBreakdown p={p} plan={sel} />
            <Link to="/kyc" className="flex items-center gap-3 rounded-[20px] bg-surface-2 p-4 text-sm">
              <ShieldCheck className={kycDone ? "text-mint" : "text-primary"} />
              <span className="flex-1">{kycDone ? "VERIFI identity verified — you're contract-ready" : "Contracts need a quick VERIFI ID check"}</span>
              {!kycDone && <span className="font-semibold text-mint">Start</span>}
            </Link>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md gap-3 border-t bg-background/90 p-4 backdrop-blur-xl">
        <button aria-label="Save" onClick={() => toggleSave(p.id)} className={"grid size-14 place-items-center rounded-2xl bg-card " + (saved.includes(p.id) ? "text-mint" : "")}><Bookmark className="size-5" fill={saved.includes(p.id) ? "currentColor" : "none"} /></button>
        <button onClick={() => { add({ id: p.id, name: p.name, image: p.image, variant: mode === "contract" ? `${color} · ${sel.name} · ${sel.months} mo · ${sel.data}` + (q.upfront ? ` · ${nad(q.upfront)} upfront` : "") : color, price, kind: "physical", mode }); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground glow-red">{added ? <><Check className="size-5" /> Added</> : "Add to Cart"}</button>
      </div>
    </Shell>
  );
}
