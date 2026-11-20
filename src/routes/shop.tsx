import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRevealOnce, pressClass } from "@/lib/retail-motion";
import { ArrowRight, Clock, LayoutGrid, List, MessageCircle, Search, ShoppingBag, Wifi, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, brands, bundles, nad, fromMonthly, stockLabel } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShopFilterSheet } from "@/components/retail/ShopFilterSheet";

const categories = ["All", "Phones", "Laptops", "Tablets", "Wearables", "Data devices", "Accessories"] as const;
const sorts = { new: "Newest", low: "Price: low to high", high: "Price: high to low" } as const;
type SortKey = keyof typeof sorts;

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { c?: string; q?: string } => ({
    ...(typeof s["c"] === "string" ? { c: s["c"] } : {}),
    ...(typeof s["q"] === "string" ? { q: s["q"] } : {}),
  }),
  head: () => ({ meta: [
    { title: "Catalog — MTC Pocket Market" },
    { name: "description", content: "Browse MTC devices, compare indicative monthly prices and shop by category." },
    { property: "og:title", content: "Catalog — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: Shop,
});

function Shop() {
  const gridReveal = useRevealOnce<HTMLDivElement>();
  const { c = "All", q: initialQuery = "" } = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const { mode, setMode, extra, setExtra, add, cart } = useStore();
  const [q, setQ] = useState(initialQuery);
  useEffect(() => { setQ(initialQuery); }, [initialQuery]);
  const [focus, setFocus] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("new");
  const [showF, setShowF] = useState(false);
  const [f, setF] = useState({ brands: [] as string[], net: "Any", maxCash: 40000, maxMonthly: 4000, storage: "Any" });
  const t = q.trim().toLowerCase();

  const list = useMemo(() => {
    const filtered = products.filter((p) =>
      (c === "All" || p.category === c)
      && (!t || [p.name, p.brand, p.category].join(" ").toLowerCase().includes(t))
      && (!f.brands.length || f.brands.includes(p.brand))
      && (f.net === "Any" || p.network === f.net)
      && (f.storage === "Any" || p.storage === f.storage)
      && (mode === "cash" ? p.cash <= f.maxCash : p.contractable && fromMonthly(p) <= f.maxMonthly)
    );
    const price = (p: (typeof filtered)[number]) => mode === "cash" ? p.cash : fromMonthly(p);
    return sort === "new"
      ? [...filtered].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
      : [...filtered].sort((a, b) => sort === "low" ? price(a) - price(b) : price(b) - price(a));
  }, [c, t, f, sort, mode]);

  const services = t ? bundles.filter((b) => (b.name + " aweh giga esim data bundle").toLowerCase().includes(t)) : [];
  const suggestions = t
    ? [...new Set([...products.map((p) => p.name), ...brands, ...bundles.map((b) => b.name)])].filter((text) => text.toLowerCase().includes(t)).slice(0, 5)
    : [];
  const commit = (value: string) => {
    setQ(value); setFocus(false);
    if (value.trim()) setExtra((prev) => ({ ...prev, searches: [value, ...prev.searches.filter((item) => item !== value)].slice(0, 6) }));
  };
  const activeCount = f.brands.length + Number(f.net !== "Any") + Number(f.storage !== "Any")
    + (mode === "cash" ? Number(f.maxCash < 40000) : Number(f.maxMonthly < 4000));
  const resetDiscovery = () => {
    setQ(""); setFocus(false);
    setF({ brands: [], net: "Any", maxCash: 40000, maxMonthly: 4000, storage: "Any" });
    void nav({ search: {} });
  };

  return (
    <Shell>
      <header className="px-5 pt-[max(24px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">POCKET MARKET</p>
            <h1 className="mt-1 text-[32px] font-bold tracking-[-0.055em]">Catalog</h1>
          </div>
          <Link to="/cart" aria-label={`Shopping bag with ${cart.reduce((count, item) => count + item.qty, 0)} items`}
            className="relative grid size-11 place-items-center rounded-full bg-white text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <ShoppingBag aria-hidden="true" className="size-5" />
            {cart.length > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {cart.reduce((count, item) => count + item.qty, 0)}
            </span>}
          </Link>
        </div>

        <div className="relative mt-5 flex items-center gap-2" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocus(false);
        }}>
          <label className="flex h-[52px] min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <Search aria-hidden="true" className="size-[18px] shrink-0 text-foreground" />
            <input type="search" aria-label="Search products and bundles" placeholder="Search devices"
              enterKeyHint="search" autoComplete="off" value={q}
              onFocus={() => setFocus(true)}
              onKeyDown={(event) => { if (event.key === "Enter") commit(q); if (event.key === "Escape") setFocus(false); }}
              onChange={(event) => setQ(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground" />
            {q && <button type="button" onClick={() => { setQ(""); setFocus(false); }} aria-label="Clear search" className="grid size-10 shrink-0 place-items-center">
              <X aria-hidden="true" className="size-4" />
            </button>}
          </label>
          <ShopFilterSheet open={showF} onOpenChange={setShowF} values={f} onChange={setF}
            brands={brands} mode={mode} results={list.length} activeCount={activeCount} />

          {focus && (suggestions.length > 0 || (!t && extra.searches.length > 0)) && (
            <div className="absolute inset-x-0 top-14 z-30 rounded-[18px] border border-border bg-white p-2 shadow-[0_12px_25px_rgba(32,46,57,0.12)]">
              {!t && <p className="px-3 py-1 text-[12px] font-medium text-muted-foreground">Recent searches</p>}
              {(t ? suggestions : extra.searches).map((suggestion) => (
                <button key={suggestion} type="button"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => commit(suggestion)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-[14px] hover:bg-surface-2">
                  {t ? <Search className="size-4 text-muted-foreground" /> : <Clock className="size-4 text-muted-foreground" />}
                  <span className="min-w-0 truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5 pb-2" aria-label="Product categories">
        {categories.map((name) => (
          <Link key={name} to="/shop" search={name === "All" ? {} : { c: name }}
            aria-current={c === name ? "page" : undefined}
            className={cn("flex h-11 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold transition-colors",
              c === name ? "bg-primary text-white" : "bg-white text-foreground hover:bg-[#E7E9E9]")}>
            {name}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 px-5">
        <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 text-[12px] font-semibold">
          <button type="button" onClick={() => setMode("cash")} aria-pressed={mode === "cash"}
            className={cn("min-h-10 rounded-full px-3 transition-colors", mode === "cash" ? "bg-primary text-white" : "text-muted-foreground")}>
            Outright
          </button>
          <button type="button" onClick={() => setMode("contract")} aria-pressed={mode === "contract"}
            className={cn("min-h-10 rounded-full px-3 transition-colors", mode === "contract" ? "bg-primary text-white" : "text-muted-foreground")}>
            Monthly est.
          </button>
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
          <SelectTrigger aria-label="Sort catalog" className="h-11 w-[128px] shrink-0 rounded-full border-0 bg-white px-3 text-[12px] font-semibold shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sorts).map(([key, value]) => <SelectItem key={key} value={key}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 px-5">
        <p role="status" className="text-[13px] text-muted-foreground">
          {list.length} device{list.length === 1 ? "" : "s"}{mode === "contract" ? " · illustrative monthly costs" : ""}
        </p>
        <button type="button" onClick={() => setView(view === "grid" ? "list" : "grid")}
          aria-label={view === "grid" ? "Switch to list view" : "Switch to grid view"}
          className="grid size-11 place-items-center rounded-full bg-white">
          {view === "grid" ? <List aria-hidden="true" className="size-5" /> : <LayoutGrid aria-hidden="true" className="size-5" />}
        </button>
      </div>

      {services.length > 0 && <section className="mt-5 px-5" aria-label="Matching digital services">
        <h2 className="text-[15px] font-bold">Related services (demo)</h2>
        {services.map((bundle) => (
          <div key={bundle.id} className="mt-2 flex min-h-16 items-center gap-3 rounded-[16px] bg-white px-4">
            <Wifi aria-hidden="true" className="size-5 shrink-0 text-mint" />
            <div className="min-w-0 flex-1"><p className="text-[14px] font-semibold">{bundle.name}</p>
              <p className="text-[12px] text-muted-foreground">{bundle.data} · {bundle.validity}</p></div>
            <Button type="button" onClick={() => {
              add({ id: bundle.id, name: bundle.name,
                variant: bundle.id === "esim" ? "eSIM · demonstration" : "Data bundle demonstration",
                price: bundle.price, kind: "digital" });
              void nav({ to: "/cart" });
            }} className={`h-11 shrink-0 rounded-full px-3 text-[13px] ${pressClass}`}>{nad(bundle.price)}</Button>
          </div>
        ))}
      </section>}

      {view === "grid" ? (
        <div key={`${c}-${sort}-${mode}`} ref={gridReveal.ref} className="mt-4 grid grid-cols-2 gap-x-4 gap-y-9 px-5 pb-7">
          {list.map((product, index) => (
            <div key={product.id} style={index < 8 ? { animationDelay: `${index * 45}ms` } : undefined}
              className={`min-w-0 ${index < 8 ? (gridReveal.visible ? "pocket-reveal" : "pocket-reveal-pending") : ""}`}>
              <ProductCard p={product} catalog />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 space-y-2 px-5 pb-6">
          {list.map((product) => {
            const stock = stockLabel(product);
            return <Link key={product.id} to="/product/$id" params={{ id: product.id }}
              className="flex min-h-[106px] items-center gap-3 rounded-[19px] bg-white p-3">
              <img src={product.image} alt={product.name} loading="lazy" className="size-20 rounded-[15px] bg-stage object-contain p-2" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[14px] font-semibold leading-5">{product.name}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">{product.brand}</p>
                <p className="mt-2 text-[16px] font-bold tabular-nums">
                  {mode === "cash" ? nad(product.cash) : nad(fromMonthly(product)) + "/mo est."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{stock.text}</p>
              </div>
              <ArrowRight aria-hidden="true" className="size-[18px] shrink-0" />
            </Link>;
          })}
        </div>
      )}

      {!list.length && <div role="status" className="mx-5 mb-8 rounded-[19px] bg-white px-5 py-8 text-center">
        <p className="text-[16px] font-semibold">No matching products</p>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">Try a different category, search or budget.</p>
        <Button type="button" variant="outline" onClick={resetDiscovery} className="mt-5 h-11 rounded-full px-5">Clear filters</Button>
      </div>}

      <div className="mx-5 mb-8 space-y-2 rounded-[19px] bg-white px-4 py-2">
        <Link to="/find" className="flex min-h-14 items-center justify-between gap-3 text-[14px] font-semibold">
          Find a contract within your budget <ArrowRight className="size-[18px] shrink-0" />
        </Link>
        {(c === "Phones" || c === "Laptops" || c === "Tablets" || c === "Wearables") && (
          <Link to="/compare" className="flex min-h-14 items-center justify-between gap-3 border-t border-border text-[14px] font-semibold">
            Compare devices <ArrowRight className="size-[18px] shrink-0" />
          </Link>
        )}
      </div>
      <p className="px-6 pb-6 text-center text-[12px] leading-5 text-muted-foreground">
        Independent concept. Device stock, monthly pricing and payments require official MTC confirmation.
      </p>

      {!focus && !showF && <div className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-md justify-end px-5">
        <Link to="/adviser" aria-label="Ask the shopping adviser"
          className="pointer-events-auto grid size-12 place-items-center rounded-full bg-primary text-white shadow-[0_4px_14px_rgba(32,46,57,0.2)]">
          <MessageCircle aria-hidden="true" className="size-5" />
        </Link>
      </div>}
    </Shell>
  );
}
