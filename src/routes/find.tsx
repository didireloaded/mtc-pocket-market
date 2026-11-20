import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Info, SlidersHorizontal, Wallet, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { nad } from "@/lib/data";
import { findContractMatches, type FinderCategory, type FinderPriority } from "@/lib/finder";

export const Route = createFileRoute("/find")({
  head: () => ({ meta: [
    { title: "Find My Contract — MTC Pocket Market" },
    { name: "description", content: "Explore MTC device and contract combinations by budget, term and data needs. Illustrative estimates only." },
    { property: "og:title", content: "Find My Contract — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: FindMyContract,
});

function FindMyContract() {
  const [category, setCategory] = useState<FinderCategory>("Phones");
  const [budget, setBudget] = useState(1200);
  const [months, setMonths] = useState<12 | 24 | 36>(24);
  const [upfrontPct, setUpfrontPct] = useState(0);
  const [priority, setPriority] = useState<FinderPriority>("affordability");
  const matches = useMemo(() => findContractMatches({ category, budget, months, upfrontPct, priority }), [category, budget, months, upfrontPct, priority]);
  const affordable = matches.some((m) => m.withinBudget);

  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Back to Home" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
          <span className="rounded-full bg-card px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Device & plan finder</span>
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-mint">Start with what works for you</p>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.12] tracking-tight">Find a contract that fits.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Tell us your budget. We'll explore device and plan combinations from the current Pocket Market catalogue.</p>
        </div>

        <div className="mt-6 rounded-[26px] bg-card p-5 shadow-card">
          <p className="text-xs font-semibold text-muted-foreground">01 · What are you looking for?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["Phones", "Laptops"] as const).map((value) => (
              <button key={value} onClick={() => setCategory(value)} aria-pressed={category === value}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold ${category === value ? "border-primary bg-primary text-primary-foreground" : "bg-background"}`}>
                {category === value && <Check className="size-4" />}{value}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div><p className="text-xs font-semibold text-muted-foreground">02 · Your monthly budget</p><p className="mt-1 text-[34px] font-bold tracking-tight">{nad(budget)}<span className="ml-1 text-sm font-medium text-muted-foreground">/ month</span></p></div>
            <Wallet className="mb-2 size-6 text-mint" />
          </div>
          <input aria-label="Maximum monthly budget" type="range" min="300" max="3000" step="50" value={budget}
            onChange={(e) => setBudget(Number(e.target.value))} className="mt-4 w-full accent-[var(--mint)]" />
          <div className="flex justify-between text-[11px] text-muted-foreground"><span>N$300</span><span>N$3,000</span></div>

          <p className="mt-6 text-xs font-semibold text-muted-foreground">03 · Preferred term</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {([12, 24, 36] as const).map((value) => <button key={value} onClick={() => setMonths(value)} aria-pressed={months === value}
              className={`h-11 rounded-xl text-xs font-semibold ${months === value ? "bg-primary text-primary-foreground" : "bg-surface-2"}`}>{value} months</button>)}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-muted-foreground">04 · Device payment upfront</p>
            <p className="text-sm font-bold">{Math.round(upfrontPct * 100)}%</p>
          </div>
          <input aria-label="Upfront device percentage" type="range" min="0" max="0.5" step="0.1" value={upfrontPct}
            onChange={(e) => setUpfrontPct(Number(e.target.value))} className="mt-3 w-full accent-[var(--mint)]" />
          <p className="mt-1 text-xs text-muted-foreground">Higher upfront payment lowers the estimated device instalment.</p>

          <p className="mt-6 text-xs font-semibold text-muted-foreground">05 · What matters most?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => setPriority("affordability")} aria-pressed={priority === "affordability"}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-xs font-semibold ${priority === "affordability" ? "border-mint bg-mint/10 text-mint" : "bg-background"}`}><SlidersHorizontal className="size-4" />Lower cost</button>
            <button onClick={() => setPriority("more-data")} aria-pressed={priority === "more-data"}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-xs font-semibold ${priority === "more-data" ? "border-mint bg-mint/10 text-mint" : "bg-background"}`}><Wifi className="size-4" />More data</button>
          </div>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-[18px] border border-[#80A7C8]/40 bg-[#E4EFF8] p-4 text-[#1D4666]">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p className="text-xs leading-5"><strong>Concept preview.</strong> Monthly payments and contract totals below are illustrative estimates, not official offers. MTC must verify financing terms, availability and eligibility before applications or payment.</p>
        </div>

        <section className="mt-8" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-mint">Your matches</p><h2 className="mt-1 text-2xl font-bold tracking-tight">{affordable ? "Within your budget" : "Closest options"}</h2></div>
            <span className="rounded-full bg-card px-3 py-2 text-xs text-muted-foreground">{matches.length} options</span>
          </div>
          {!affordable && matches.length > 0 && <p className="mt-2 text-sm text-muted-foreground">No currently modelled option fits {nad(budget)} per month. These are the closest estimates and are above your budget.</p>}
          <div className="mt-4 space-y-3">
            {matches.map((m, index) => (
              <article key={m.product.id} className="overflow-hidden rounded-[24px] bg-card shadow-card">
                <div className="flex items-center gap-4 p-4">
                  <div className="grid size-28 shrink-0 place-items-center rounded-[18px] bg-stage p-2"><img src={m.product.image} alt={m.product.name} loading="lazy" className="h-full w-full object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-mint">{index === 0 ? "Best match" : "Alternative"} · Estimate</p>
                    <h3 className="mt-1 text-base font-bold leading-5">{m.product.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{m.plan.name} · {months} months</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight">{nad(m.monthly)}<span className="ml-1 text-xs font-normal text-muted-foreground">/mo</span></p>
                    <p className={`mt-1 text-[11px] font-medium ${m.withinBudget ? "text-mint" : "text-brand-red"}`}>{m.withinBudget ? "Within selected budget" : `${nad(m.overBudgetBy)} over budget`}</p>
                  </div>
                </div>
                <div className="mx-4 border-t py-3 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-3"><span>Device + plan per month</span><span>{nad(m.deviceMonthly)} + {nad(m.planMonthly)}</span></div>
                  <div className="mt-2 flex justify-between gap-3"><span>Estimated amount due upfront</span><span className="font-semibold text-foreground">{nad(m.payToday)}</span></div>
                  <div className="mt-2 flex justify-between gap-3"><span>Estimated full-term cost</span><span className="font-semibold text-foreground">{nad(m.totalOverTerm)}</span></div>
                  <p className="mt-2">{m.allowances}</p>
                </div>
                <Link to="/product/$id" params={{ id: m.product.id }} className="flex items-center justify-between border-t px-4 py-3 text-sm font-semibold text-mint">
                  Review device and plans <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
          {!matches.length && <div className="mt-4 rounded-[20px] bg-card p-5 text-sm text-muted-foreground">No eligible models in this category. Try another device category.</div>}
        </section>
        <p className="pt-6 text-center text-xs leading-5 text-muted-foreground">Suggestions are based on budget and estimated plan allowances. This is not an AI-generated credit or eligibility decision.</p>
      </div>
    </Shell>
  );
}
