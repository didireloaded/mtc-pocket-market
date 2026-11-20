import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, SlidersHorizontal, Wallet, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shell } from "@/components/Shell";
import { ConceptNotice, Eyebrow, PriceRow, ProductStage, RetailPanel, SectionHeading } from "@/components/retail/RetailPrimitives";
import { ContractBudgetControl, ContractTermControl, UpfrontControl, type ContractTerm } from "@/components/retail/ContractControls";
import { nad } from "@/lib/data";
import { findContractMatches, type FinderCategory, type FinderPriority } from "@/lib/finder";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find")({
  head: () => ({ meta: [
    { title: "Find My Contract — MTC Pocket Market" },
    { name: "description", content: "Explore illustrative device and plan combinations based on your monthly budget and needs." },
    { property: "og:title", content: "Find My Contract" },
    { property: "og:description", content: "Explore MTC catalog devices and illustrative plan combinations for your budget." },
    { name: "twitter:card", content: "summary" },
    { property: "og:type", content: "website" },
  ] }),
  component: FindMyContract,
});

function FindMyContract() {
  const [category, setCategory] = useState<FinderCategory>("Phones");
  const [budget, setBudget] = useState(1200);
  const [months, setMonths] = useState<ContractTerm>(24);
  const [upfrontPct, setUpfrontPct] = useState(0);
  const [priority, setPriority] = useState<FinderPriority>("affordability");

  const matches = useMemo(
    () => findContractMatches({ category, budget, months, upfrontPct, priority }),
    [category, budget, months, upfrontPct, priority],
  );
  const affordable = matches.some((match) => match.withinBudget);

  return <Shell>
    <div className="px-5 pb-10 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="secondary" size="icon" className="size-11 rounded-full bg-card shadow-none">
          <Link to="/" aria-label="Back to Home"><ArrowLeft className="size-5" /></Link>
        </Button>
        <Badge variant="secondary" className="rounded-full px-3 py-2 text-[12px]">Plan explorer</Badge>
      </div>

      <header className="mt-8">
        <Eyebrow>Find my contract</Eyebrow>
        <h1 className="retail-title mt-3">Start with your budget.</h1>
        <p className="retail-muted mt-3">Select a device category, monthly budget and contract preference. We'll show combinations from the Pocket Market catalogue.</p>
      </header>

      <RetailPanel className="mt-7 space-y-7">
        <div>
          <p id="category-label" className="mb-3 text-[14px] font-semibold">What are you shopping for?</p>
          <Tabs value={category} onValueChange={(value) => setCategory(value as FinderCategory)}>
            <TabsList aria-labelledby="category-label" className="grid h-auto w-full grid-cols-2 gap-2 rounded-[16px] bg-surface-2 p-1.5">
              <TabsTrigger value="Phones" className="h-11 rounded-[12px] text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-none">Smartphones</TabsTrigger>
              <TabsTrigger value="Laptops" className="h-11 rounded-[12px] text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-none">Laptops</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="retail-divider pt-6"><ContractBudgetControl budget={budget} onChange={setBudget} /></div>
        <div className="retail-divider pt-6"><ContractTermControl months={months} onChange={setMonths} /></div>
        <div className="retail-divider pt-6"><UpfrontControl value={upfrontPct} onChange={setUpfrontPct} /></div>

        <div className="retail-divider pt-6">
          <p className="mb-3 text-[14px] font-semibold">What matters most?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={priority === "affordability" ? "default" : "outline"}
              aria-pressed={priority === "affordability"} onClick={() => setPriority("affordability")}
              className="h-12 rounded-[15px] px-2 text-[13px] shadow-none"><Wallet className="size-4" />Lower monthly cost</Button>
            <Button type="button" variant={priority === "more-data" ? "default" : "outline"}
              aria-pressed={priority === "more-data"} onClick={() => setPriority("more-data")}
              className="h-12 rounded-[15px] px-2 text-[13px] shadow-none"><Wifi className="size-4" />More data</Button>
          </div>
        </div>
      </RetailPanel>

      <ConceptNotice className="mt-5"><strong>Illustrative estimates only.</strong> Contract pricing, availability and eligibility must be verified by MTC before an application or payment.</ConceptNotice>

      <section className="mt-9" aria-label="Device and plan matches">
        <SectionHeading title={affordable ? "Matches your budget" : "Closest options"} description={`${matches.length} device and plan combinations`} />
        {!affordable && matches.length > 0 && <p className="retail-muted mt-3">There are no modelled options within {nad(budget)} per month. These estimates are higher than your budget.</p>}

        <div className="mt-4 space-y-4">
          {matches.map((match, index) =>
            <RetailPanel key={match.product.id} className="overflow-hidden p-0">
              <div className="flex items-start gap-4 p-4">
                <ProductStage src={match.product.image} alt={match.product.name} className="size-28 shrink-0 rounded-[16px] p-2" />
                <div className="min-w-0 flex-1">
                  <Badge variant={index === 0 && affordable ? "default" : "secondary"} className="rounded-full text-[11px] shadow-none">
                    {index === 0 && affordable ? "Best match" : "Estimated option"}
                  </Badge>
                  <h3 className="mt-3 text-[16px] font-bold leading-5">{match.product.name}</h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">{match.plan.name} · {months} months</p>
                  <p className="mt-2 text-[24px] font-bold leading-7 tracking-tight tabular-nums">{nad(match.monthly)}<span className="ml-1 text-[13px] font-medium text-muted-foreground">/mo</span></p>
                  <p className={cn("mt-1 text-[12px] font-semibold", match.withinBudget ? "text-mint" : "text-brand-red")}>
                    {match.withinBudget ? "Within your budget" : `${nad(match.overBudgetBy)} above budget`}
                  </p>
                </div>
              </div>

              <div className="mx-4 border-t border-border/70 py-2">
                <PriceRow label="Device instalment / month" value={nad(match.deviceMonthly)} />
                <PriceRow label="Plan / month" value={nad(match.planMonthly)} />
                <PriceRow label="Amount due upfront" value={nad(match.payToday)} />
                <PriceRow label="Estimated total over term" value={nad(match.totalOverTerm)} emphasis />
                <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{match.allowances}</p>
              </div>
              <div className="p-4 pt-2">
                <Button asChild className="h-12 w-full rounded-full text-sm font-semibold shadow-none">
                  <Link to="/product/$id" params={{ id: match.product.id }}>Explore this device <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </RetailPanel>,
          )}
          {matches.length === 0 && <RetailPanel><p className="retail-muted">No eligible combinations in this category yet. Try another category.</p></RetailPanel>}
        </div>
      </section>

      <div className="mt-7 flex items-center justify-center gap-2 text-[12px] leading-5 text-muted-foreground">
        <SlidersHorizontal className="size-4 shrink-0" /><p>Recommendations are based on basic matching rules, not a credit decision.</p>
      </div>
    </div>
  </Shell>;
}
