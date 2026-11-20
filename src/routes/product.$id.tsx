import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Share2, ShieldCheck, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { getProduct, nad, plansFor, quote, stockLabel, TERMS, MTC_STORES, fromMonthly, CONNECTION_FEE } from "@/lib/data";
import { ContractBreakdown } from "@/components/ContractBreakdown";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ConceptNotice, Eyebrow } from "@/components/retail/RetailPrimitives";
import { UpfrontControl } from "@/components/retail/ContractControls";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => { const p = getProduct(params.id); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => ({ meta: [{ title: (loaderData?.name ?? "Device") + " — MTC Store" }, { name: "description", content: loaderData?.tagline ?? "Device details" }, { property: "og:title", content: (loaderData?.name ?? "Device") + " — MTC Store" }, { property: "og:description", content: loaderData?.tagline ?? "Device details" }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : [])] }),
  component: PDP,
});
function PDP() {
  const p = Route.useLoaderData();
  const router = useRouter();
  const { mode, setMode, add, saved, toggleSave, viewProduct } = useStore();
  useEffect(() => { viewProduct(p.id); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [months, setMonths] = useState<number>(24);
  const [upPct, setUpPct] = useState(0);
  const [slide, setSlide] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imgs = [p.image, ...(p.gallery ?? [])];
  const st = stockLabel(p);
  const [tab, setTab] = useState<"overview" | "plans">("overview");
  const [color, setColor] = useState(p.colors[0]!);
  const avail = plansFor(p);
  const [plan, setPlan] = useState<string>(avail[0]!.id);
  const sel = avail.find((x) => x.id === plan) ?? avail[0]!;
  const contract = mode === "contract" && p.contractable;
  const opt = { months, upfrontPct: upPct };
  const q = quote(p, sel, opt);
  const price = contract ? q.monthly : p.cash;
  const goToSlide = (index: number) => {
    galleryRef.current?.scrollTo({ left: index * galleryRef.current.clientWidth, behavior: "smooth" });
    setSlide(index);
  };
  const shareProduct = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied");
      } else {
        toast.error("Use the browser's share or copy-link option.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Couldn't share this product. Please try again.");
    }
  };
  return (
    <Shell nav={false}>
      <div className="relative">
        <div ref={galleryRef} onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar flex h-[335px] snap-x snap-mandatory overflow-x-auto bg-stage sm:h-[380px]">
          {imgs.map((src, i) => <img key={src} src={src} alt={`${p.name} photo ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="h-full w-full shrink-0 snap-center object-contain px-10 pb-10 pt-16" />)}
        </div>
                {imgs.length > 1 && <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1" role="group" aria-label="Product images">
          {imgs.map((_, i) => <button key={i} type="button" aria-label={`View product photo ${i + 1}`}
            aria-current={i === slide ? "true" : undefined} onClick={() => goToSlide(i)}
            className="grid size-10 place-items-center rounded-full">
            <span className={"h-1.5 rounded-full transition-all " + (i === slide ? "w-6 bg-primary" : "w-2 bg-foreground/35")} />
          </button>)}
        </div>}
        <button type="button" aria-label="Back" onClick={() => router.history.back()} className="absolute left-5 top-6 grid size-11 place-items-center rounded-full border border-border bg-white/95"><ArrowLeft className="size-5" /></button>
        <button type="button" aria-label="Share or copy product link" onClick={() => { void shareProduct(); }} className="absolute right-5 top-6 grid size-11 place-items-center rounded-full border border-border bg-white/95"><Share2 className="size-5" /></button>
      </div>
      <div className="relative px-5 pb-36 pt-6">
        <Eyebrow>{p.category}</Eyebrow>
        <div className="mt-2">
          <h1 className="text-[30px] font-bold leading-[1.08] tracking-[-0.055em]">{p.name}</h1>
          <p className="mt-4 text-[13px] font-medium text-muted-foreground">{contract ? "Estimated monthly payment" : "Outright price"}</p>
          <p className="mt-1 text-[30px] font-bold leading-9 tracking-[-0.055em] tabular-nums text-foreground">
            {nad(price)}{contract && <span className="ml-1 text-[14px] font-medium tracking-normal text-muted-foreground">/month</span>}
          </p>
        </div>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">{p.tagline}</p>
        <ConceptNotice className="mt-4">Pocket Market concept preview. Contract instalments are estimates and require MTC confirmation before any application or payment.</ConceptNotice>
        <p className="mt-3 text-[13px] font-medium text-muted-foreground">{st.text}</p>
        {p.contractable && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" aria-pressed={!contract} onClick={() => { setMode("cash"); setTab("overview"); }}
              className={"h-auto min-h-24 flex-col items-start justify-center rounded-[13px] px-4 py-3 text-left shadow-none " + (!contract ? "border-primary bg-white" : "border-border bg-transparent")}>
              <span className="text-[12px] font-semibold text-muted-foreground">Buy outright</span><span className="text-[19px] font-bold tabular-nums">{nad(p.cash)}</span><span className="text-[12px] font-normal text-muted-foreground">One-time cost</span></Button>
            <Button type="button" variant="outline" aria-pressed={contract} onClick={() => { setMode("contract"); setTab("plans"); }}
              className={"h-auto min-h-24 flex-col items-start justify-center rounded-[13px] px-4 py-3 text-left shadow-none " + (contract ? "border-primary bg-white" : "border-border bg-transparent")}>
              <span className="text-[12px] font-semibold text-muted-foreground">Contract estimate</span><span className="text-[18px] font-bold tabular-nums">{nad(fromMonthly(p))}/mo</span><span className="text-[12px] font-normal text-muted-foreground">+ {nad(CONNECTION_FEE)} connection</span></Button>
          </div>)}
        {p.category === "Laptops" && <Link to="/compare/macbooks" className="mt-4 block border-b border-border py-4 text-[14px] font-medium">Compare all MacBooks: outright vs Select plans <span className="text-mint">→</span></Link>}
        <details className="mt-2 border-b border-border py-4 text-[14px]"><summary className="cursor-pointer font-semibold">View potential collection locations</summary><p className="mt-2 text-[13px] leading-6 text-muted-foreground">These branch names come from the published collection list. Inventory and reservation availability have not been verified.</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{MTC_STORES.join(" · ")}</p></details>
        <div className="mt-4 flex items-center justify-between">{!p.contractable && <span className="text-[13px] text-muted-foreground">Cash purchase only</span>}
          {p.colors.length > 1 && <div className="flex gap-2">{p.colors.map((c) => <button key={c} onClick={() => setColor(c)} className={"min-h-11 rounded-[10px] border px-3 py-2 text-[13px] font-medium " + (color === c ? "border-primary bg-white text-foreground" : "border-border text-muted-foreground")}>{c}</button>)}</div>}
        </div>
        {p.contractable && <Tabs value={tab} onValueChange={(value) => setTab(value as "overview" | "plans")} className="mt-6">
          <TabsList className="grid h-12 w-full grid-cols-2 gap-1 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger value="overview" className="h-12 rounded-none border-b-2 border-transparent bg-transparent text-[14px] font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">Overview</TabsTrigger>
            <TabsTrigger value="plans" className="h-10 rounded-full text-[13px] font-semibold data-[state=active]:bg-card data-[state=active]:shadow-none">Plans</TabsTrigger>
          </TabsList>
        </Tabs>}
        {contract && tab === "overview" && <div className="mt-4"><ContractBreakdown p={p} plan={sel} opt={opt} /></div>}
        {tab === "overview" ? (<>
          <div className="mt-5 flex items-center justify-between gap-3 text-[12px]"><span className="text-muted-foreground">Specs and cash price as listed by MTC</span><a href={p.source} target="_blank" rel="noreferrer" className="font-semibold text-mint">View on mtc.com.na ↗</a></div>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {p.specs.map((spec) => <div key={spec.label} className="flex min-h-14 items-start justify-between gap-4 py-4">
              <dt className="text-[14px] text-muted-foreground">{spec.label}</dt>
              <dd className="max-w-[58%] text-right text-[15px] font-semibold leading-5">{spec.value}</dd>
            </div>)}
          </dl>
        </>) : (
          <div className="mt-4 space-y-3">
            {avail.map((pl) => (
              <Button key={pl.id} type="button" variant="outline"
                aria-pressed={plan === pl.id}
                onClick={() => { setPlan(pl.id); if (!(pl.terms as readonly number[]).includes(months)) setMonths(pl.terms[0]!); }}
                className={"flex h-auto min-h-[78px] w-full items-center justify-between gap-3 whitespace-normal rounded-[12px] bg-white p-4 text-left shadow-none " + (plan === pl.id ? "border-primary" : "border-border")}>
                <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold">{pl.name}</span><span className="mt-1 block text-[12px] leading-5 text-muted-foreground">{pl.data} · {pl.mins} · {pl.sms}</span></span>
                <span className="shrink-0 text-right text-[15px] font-bold tabular-nums">{nad(quote(p, pl, opt).monthly)}<span className="block text-[12px] font-normal text-muted-foreground">/ month</span></span>
              </Button>
            ))}
            <div className="space-y-6 border-y border-border py-5">
              <div><p className="mb-3 text-[14px] font-semibold">Contract duration</p>
                <ToggleGroup type="single" value={String(months)} onValueChange={(value) => { if (value) setMonths(Number(value)); }}
                  className="grid grid-cols-4 gap-2">
                  {TERMS.filter((m) => (sel.terms as readonly number[]).includes(m)).map((m) =>
                    <ToggleGroupItem key={m} value={String(m)} className="h-11 rounded-[12px] border bg-surface-2 text-[13px] font-semibold data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{m} mo</ToggleGroupItem>)}
                </ToggleGroup>
              </div>
              <div className="border-t border-border/70 pt-5"><UpfrontControl value={upPct} onChange={setUpPct} cash={p.cash} /></div>
            </div>
            <ContractBreakdown p={p} plan={sel} opt={opt} />
            <Link to="/kyc" className="flex items-center gap-3 border-y border-border py-4 text-[14px]">
              <ShieldCheck className="text-primary" />
              <span className="flex-1">Official MTC identity verification is required before applying</span>
              <span className="font-semibold text-mint">Learn more</span>
            </Link>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md gap-3 border-t border-border bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button type="button" aria-label={saved.includes(p.id) ? "Remove saved device" : "Save device"} aria-pressed={saved.includes(p.id)}
          variant="secondary" size="icon" onClick={() => toggleSave(p.id)}
          className={"size-14 rounded-[12px] border border-border bg-white shadow-none " + (saved.includes(p.id) ? "text-brand-red" : "")}>
          <Bookmark className="size-5" fill={saved.includes(p.id) ? "currentColor" : "none"} /></Button>
        <Button type="button" onClick={() => { add({ id: p.id, name: p.name, image: p.image, variant: contract ? `${color} · ${sel.name} · ${months} mo · ${sel.data}` + (q.upfront ? ` · ${nad(q.upfront)} upfront` : "") : color, price, kind: "physical", mode: contract ? "contract" : "cash" }); void router.navigate({ to: "/cart" }); }}
          disabled={st.tone === "out"} className="h-14 min-w-0 flex-1 rounded-[12px] px-4 text-[14px] font-semibold shadow-none"><ShoppingBag className="size-5 shrink-0" />{st.tone === "out" ? "Out of stock" : contract ? "Add selected plan to bag" : "Add to bag"}</Button>
      </div>
    </Shell>
  );
}
