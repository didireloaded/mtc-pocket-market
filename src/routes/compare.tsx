import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitCompareArrows, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { CATEGORIES, fromMonthly, nad, products, type Category, type Product } from "@/lib/data";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [
    { title: "Compare devices — MTC Pocket Market" },
    { name: "description", content: "Compare device prices, connectivity, storage and available details side by side." },
    { property: "og:title", content: "Compare devices" },
    { property: "og:description", content: "Compare MTC catalog device prices, connectivity and specifications side by side." },
    { name: "twitter:card", content: "summary" },
    { property: "og:type", content: "website" },
  ] }),
  component: CompareDevices,
});

function CompareDevices() {
  const [category, setCategory] = useState<Category>("Phones");
  const options = useMemo(() => products.filter((p) => p.category === category), [category]);
  const [selected, setSelected] = useState<string[]>([]);
  const left = options.find((p) => p.id === selected[0]) ?? options[0];
  const right = options.find((p) => p.id === selected[1] && p.id !== left?.id) ?? options.find((p) => p.id !== left?.id);
  const compared = [left, right].filter((p): p is Product => Boolean(p));
  const specs = [...new Set(compared.flatMap((p) => p.specs.map((s) => s.label)))].slice(0, 8);
  const choose = (index: number, value: string) => setSelected((old) => {
    const next = [...old]; next[index] = value; return next;
  });
  const setKind = (value: Category) => { setCategory(value); setSelected([]); };

  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <Link to="/shop" aria-label="Back to Shop" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <div className="mt-8 flex items-center gap-2 text-mint"><GitCompareArrows className="size-5" /><p className="text-xs font-bold uppercase tracking-[0.16em]">Device comparison</p></div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">See the difference.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Choose two devices and compare what matters. Details are limited to the specifications available in the current catalogue.</p>
        <label className="mt-6 block text-xs font-semibold text-muted-foreground">Product category
          <select value={category} onChange={(e) => setKind(e.target.value as Category)} className="mt-2 h-12 w-full rounded-2xl border bg-card px-4 text-sm font-semibold text-foreground">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {compared.length === 2 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {compared.map((p, i) => <div key={i} className="min-w-0 rounded-[22px] bg-card p-3 shadow-card">
                <label className="block text-[11px] font-semibold text-muted-foreground">Device {i + 1}
                  <select value={p.id} onChange={(e) => choose(i, e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border bg-background px-2 text-xs font-semibold text-foreground">
                    {options.filter((x) => x.id === p.id || !compared.some((item) => item.id === x.id)).map((x) =>
                      <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </label>
                <div className="mt-3 grid aspect-square place-items-center rounded-2xl bg-stage p-2">
                  <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <h2 className="mt-3 min-h-12 text-sm font-bold leading-5">{p.name}</h2>
                <Link to="/product/$id" params={{ id: p.id }} className="mt-3 flex items-center gap-1 text-xs font-semibold text-mint">View details <ArrowUpRight className="size-3" /></Link>
              </div>)}
            </div>
            <div className="mt-5 rounded-[22px] bg-card p-4 shadow-card">
              <h2 className="font-bold">At a glance</h2>
              {[
                { label: "Buy outright", values: compared.map((p) => nad(p.cash)) },
                { label: "Estimated contract", values: compared.map((p) => p.contractable ? `from ${nad(fromMonthly(p))}/mo` : "Not modelled") },
                { label: "Connectivity", values: compared.map((p) => p.network === "None" ? "Not specified" : p.network) },
                { label: "Storage", values: compared.map((p) => p.storage ?? "Not specified") },
                ...specs.map((label) => ({ label, values: compared.map((p) => p.specs.find((s) => s.label === label)?.value ?? "Not specified") })),
              ].map((row) => <div key={row.label} className="border-b py-3 last:border-b-0">
                <p className="text-[11px] font-semibold text-muted-foreground">{row.label}</p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm font-semibold leading-5">
                  {row.values.map((value, i) => <p key={i} className="min-w-0 break-words">{value}</p>)}
                </div>
              </div>)}
            </div>
            <Link to="/find" className="mt-5 flex items-center justify-between rounded-[22px] bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground">Find a contract for your budget <ArrowRight className="size-4" /></Link>
          </>
        ) : <p className="mt-5 rounded-[20px] bg-card p-6 text-sm text-muted-foreground">There aren't enough products in this category to compare yet.</p>}
        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0" />Contract amounts are illustrative, and not all product specifications are available. Compare against MTC's official details before buying.</p>
      </div>
    </Shell>
  );
}
