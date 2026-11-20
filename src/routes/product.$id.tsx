import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Minus, Plus, Share2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/Shell";
import { getProduct, nad, plansFor, quote, stockLabel, TERMS } from "@/lib/data";
import { ContractBreakdown } from "@/components/ContractBreakdown";
import { UpfrontControl } from "@/components/retail/ContractControls";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => { const product = getProduct(params.id); if (!product) throw notFound(); return product; },
  head: ({ loaderData }) => ({ meta: [
    { title: (loaderData?.name ?? "Device") + " — MTC Pocket Market" },
    { name: "description", content: loaderData?.tagline ?? "Device details" },
    { property: "og:title", content: (loaderData?.name ?? "Device") + " — MTC Pocket Market" },
    { property: "og:type", content: "product" },
    ...(loaderData ? [{ property: "og:image", content: loaderData.image }] : []),
  ] }),
  component: ProductDetail,
});

function ProductDetail() {
  const p = Route.useLoaderData();
  const router = useRouter();
  const { mode, setMode, add, saved, toggleSave, viewProduct } = useStore();
  useEffect(() => { viewProduct(p.id); }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const imgs = [p.image, ...(p.gallery ?? [])];
  const galleryRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [color, setColor] = useState(p.colors[0] ?? "Standard");
  const [qty, setQty] = useState(1);
  const [months, setMonths] = useState(24);
  const [upfrontPct, setUpfrontPct] = useState(0);

  const availablePlans = plansFor(p);
  const [selectedPlan, setSelectedPlan] = useState(availablePlans[0]?.id ?? "");
  const plan = availablePlans.find((item) => item.id === selectedPlan) ?? availablePlans[0]!;
  const contract = p.contractable && mode === "contract";
  const options = { months, upfrontPct };
  const pricing = quote(p, plan, options);
  const price = contract ? pricing.monthly : p.cash;
  const savedProduct = saved.includes(p.id);
  const stock = stockLabel(p);

  const changePhoto = (index: number) => {
    galleryRef.current?.scrollTo({ left: index * galleryRef.current.clientWidth, behavior: "smooth" });
    setSlide(index);
  };

  const shareProduct = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied");
      } else toast.error("Use your browser's share menu to copy this link.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Couldn't share the link. Please try again.");
    }
  };

  const addToCart = () => {
    const item = {
      id: p.id,
      name: p.name,
      image: p.image,
      variant: contract
        ? `${color} · ${plan.name} · ${months} months · ${plan.data}${pricing.upfront ? ` · ${nad(pricing.upfront)} upfront` : ""}`
        : color,
      price,
      kind: "physical" as const,
      mode: contract ? "contract" as const : "cash" as const,
    };
    for (let index = 0; index < (contract ? 1 : qty); index++) add(item);
    void router.navigate({ to: "/cart" });
  };

  return (
    <Shell nav={false}>
      <div className={cn("relative overflow-hidden", p.featured
        ? "bg-[linear-gradient(145deg,#E1E7E7_0%,#F2F4F2_70%,#E9EDEA_100%)]"
        : "bg-[#F1F2EF]")}>
        {p.featured && <div aria-hidden="true"
          className="pointer-events-none absolute inset-x-[13%] bottom-[48px] h-[65px] rounded-[50%] border border-white/90 shadow-[0_8px_24px_rgba(32,46,57,0.04)]" />}
        <div ref={galleryRef} onScroll={(event) => {
          setSlide(Math.max(0, Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth)));
        }} className={cn("no-scrollbar relative z-10 flex snap-x snap-mandatory overflow-x-auto", p.featured ? "h-[min(64dvh,600px)] min-h-[450px]" : "h-[min(54dvh,540px)] min-h-[365px]")}>
          {imgs.map((src, index) => (
            <div key={src + index} className="flex h-full w-full shrink-0 snap-center items-center justify-center px-6 pb-12 pt-[70px]">
              <img src={src} alt={`${p.name} view ${index + 1}`} loading={index ? "lazy" : "eager"} decoding="async"
                className={cn("h-full w-full object-contain drop-shadow-[0_18px_16px_rgba(32,46,57,0.10)]", p.featured ? "max-h-[485px]" : "max-h-[390px]")} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-5 top-[max(18px,env(safe-area-inset-top))] z-20 flex items-center justify-between">
          <Link to="/shop" aria-label="Back to catalog"
            className="grid size-11 place-items-center rounded-full bg-white/95 text-foreground">
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>
          <button type="button" aria-pressed={savedProduct}
            aria-label={savedProduct ? "Remove saved device" : "Save this device"}
            onClick={() => toggleSave(p.id)}
            className="grid size-11 place-items-center rounded-full bg-white/95 text-foreground">
            <Heart aria-hidden="true" className={cn("size-[21px]", savedProduct && "fill-primary text-primary")} />
          </button>
        </div>
        {imgs.length > 1 && <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center gap-0.5" aria-label="Device gallery">
          {imgs.map((_, index) => (
            <button key={index} type="button" onClick={() => changePhoto(index)}
              aria-label={`Show product view ${index + 1}`} aria-current={slide === index ? "true" : undefined}
              className="grid size-10 place-items-center rounded-full">
              <span className={cn("h-1.5 rounded-full transition-all", slide === index ? "w-6 bg-primary" : "w-2 bg-[#9AA5A9]")} />
            </button>
          ))}
        </div>}
      </div>

      <div className="relative z-20 -mt-8 min-h-[380px] rounded-t-[34px] bg-white px-6 pb-36 pt-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-muted-foreground">{p.brand}</p>
            <h1 className={cn("mt-2 font-bold leading-[1.07] tracking-[-0.055em]", p.featured ? "text-[30px]" : "text-[26px]")}>{p.name}</h1>
          </div>
          <button type="button" onClick={() => { void shareProduct(); }} aria-label="Share device"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F1F2EF]">
            <Share2 aria-hidden="true" className="size-[19px]" />
          </button>
        </div>
        <p className="mt-3 text-[14px] leading-6 text-muted-foreground">{p.tagline}</p>

        {p.colors.length > 1 && <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold">Available choices</p>
          <div className="flex flex-wrap gap-2">{p.colors.map((option) => (
            <button key={option} type="button" onClick={() => setColor(option)} aria-pressed={color === option}
              className={cn("min-h-11 rounded-full border px-4 text-[13px] font-semibold",
                color === option ? "border-[#202E39] bg-[#202E39] text-white" : "border-border bg-white text-foreground")}>
              {option}
            </button>
          ))}</div>
        </div>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-muted-foreground">{contract ? "Estimated monthly payment" : "Outright price"}</p>
            <p className="mt-1 text-[29px] font-bold leading-9 tracking-[-0.055em] tabular-nums">
              {nad(price)}
              {contract && <span className="ml-1 text-[12px] font-medium tracking-normal text-muted-foreground">/mo</span>}
            </p>
          </div>
          {!contract && <div className="inline-flex shrink-0 items-center rounded-full bg-[#F1F2EF] px-1">
            <button type="button" onClick={() => setQty((number) => Math.max(1, number - 1))}
              aria-label="Decrease quantity" disabled={qty <= 1}
              className="grid size-11 place-items-center rounded-full disabled:opacity-30">
              <Minus aria-hidden="true" className="size-[17px]" />
            </button>
            <span aria-live="polite" className="min-w-6 text-center text-[15px] font-semibold tabular-nums">{qty}</span>
            <button type="button" onClick={() => setQty((number) => Math.min(10, number + 1))}
              aria-label="Increase quantity" disabled={qty >= 10}
              className="grid size-11 place-items-center rounded-full disabled:opacity-30">
              <Plus aria-hidden="true" className="size-[17px]" />
            </button>
          </div>}
        </div>
        <p className="mt-2 text-[12px] leading-5 text-muted-foreground">{stock.text}</p>

        {p.contractable && <section className="mt-6">
          <p className="mb-3 text-[13px] font-semibold">How would you like to get it?</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode("cash")} aria-pressed={!contract}
              className={cn("flex min-h-[55px] items-center justify-center rounded-[14px] border px-2 text-[13px] font-semibold",
                !contract ? "border-[#202E39] bg-[#202E39] text-white" : "border-border bg-[#F5F5F3]")}>
              Buy outright
            </button>
            <button type="button" onClick={() => setMode("contract")} aria-pressed={contract}
              className={cn("flex min-h-[55px] items-center justify-center rounded-[14px] border px-2 text-[13px] font-semibold",
                contract ? "border-[#202E39] bg-[#202E39] text-white" : "border-border bg-[#F5F5F3]")}>
              Pay monthly (est.)
            </button>
          </div>
        </section>}

        {contract && <section className="mt-6 space-y-5" aria-label="Illustrative contract builder">
          <p className="text-[14px] font-semibold">Choose your plan</p>
          <div className="space-y-2">
            {availablePlans.map((item) => (
              <button key={item.id} type="button" onClick={() => {
                setSelectedPlan(item.id);
                if (!(item.terms as readonly number[]).includes(months)) setMonths(item.terms[0]!);
              }} aria-pressed={item.id === plan.id}
                className={cn("flex min-h-[65px] w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left",
                  item.id === plan.id ? "border-[#202E39] bg-[#F5F5F3]" : "border-border bg-white")}>
                <span className="min-w-0"><span className="block text-[14px] font-semibold">{item.name}</span>
                  <span className="mt-1 block text-[12px] text-muted-foreground">{item.data} · {item.mins}</span></span>
                <span className="shrink-0 text-right text-[14px] font-bold tabular-nums">
                  {nad(quote(p, item, options).monthly)}<span className="block text-[11px] font-medium text-muted-foreground">/mo est.</span>
                </span>
              </button>
            ))}
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold">Duration</p>
            <div className="grid grid-cols-4 gap-2">
              {TERMS.filter((term) => (plan.terms as readonly number[]).includes(term)).map((term) => (
                <button key={term} type="button" onClick={() => setMonths(term)} aria-pressed={months === term}
                  className={cn("min-h-11 rounded-[12px] text-[12px] font-semibold",
                    months === term ? "bg-[#202E39] text-white" : "bg-[#F1F2EF] text-foreground")}>
                  {term} mo
                </button>
              ))}
            </div>
          </div>
          <UpfrontControl value={upfrontPct} onChange={setUpfrontPct} cash={p.cash} />
          <ContractBreakdown p={p} plan={plan} opt={options} />
          <Link to="/kyc" className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-3 text-[13px] font-semibold">
            <ShieldCheck aria-hidden="true" className="size-[19px] shrink-0 text-mint" />
            <span className="flex-1">Learn about official contract verification</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>}

        <details className="mt-6 border-t border-border pt-4">
          <summary className="cursor-pointer py-2 text-[14px] font-semibold">Device specifications</summary>
          <dl className="mt-3 divide-y divide-border">
            {p.specs.map((item) => <div key={item.label} className="flex items-start justify-between gap-4 py-3 text-[13px]">
              <dt className="text-muted-foreground">{item.label}</dt><dd className="max-w-[60%] text-right font-semibold">{item.value}</dd>
            </div>)}
          </dl>
          <a href={p.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-mint">
            View original MTC product listing <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </details>
        <div className="mt-4 border-t border-border py-4">
          <Link to="/stores" className="flex min-h-11 items-center justify-between gap-3 text-[14px] font-semibold">
            Check collection locations <ArrowRight aria-hidden="true" className="size-[18px]" />
          </Link>
          <p className="text-[12px] leading-5 text-muted-foreground">Branch stock and reservation availability are not verified.</p>
        </div>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          Independent concept preview. No live MTC purchase, contract approval or payment is available yet.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-white px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
        <Button type="button" onClick={addToCart} disabled={stock.tone === "out"}
          className="h-[54px] w-full rounded-full bg-[#202E39] text-[14px] font-semibold text-white shadow-none hover:bg-[#364653]">
          {stock.tone === "out" ? "Unavailable" : contract ? "Add selected plan to cart" : `Add to cart · ${nad(p.cash * qty)}`}
          {stock.tone !== "out" && <ShoppingBag aria-hidden="true" className="ml-2 size-[18px]" />}
        </Button>
      </div>
    </Shell>
  );
}
