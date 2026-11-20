import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, LayoutGrid, List, SlidersHorizontal, Clock, Wifi, X, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell, PriceToggle } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, brands, bundles, nad, fromMonthly, stockLabel } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const all = ["All", "Phones", "Laptops", "Tablets", "Wearables", "Data devices", "Accessories"];
const sorts = { new: "Newest", low: "Price: low to high", high: "Price: high to low" } as const;
type SortKey = keyof typeof sorts;
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { c?: string } => (typeof s["c"] === "string" ? { c: s["c"] } : {}),
  head: () => ({ meta: [{ title: "Shop Devices — MTC Store" }, { name: "description", content: "Explore the current MTC Pocket Market device selection and indicative contract pricing." }, { property: "og:title", content: "Shop Devices — MTC Store" }, { property: "og:description", content: "Explore devices and indicative contract pricing." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Shop,
});
function Shop() {
  const { c = "All" } = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const { mode, extra, setExtra, add } = useStore();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("new");
  const [showF, setShowF] = useState(false);
  const [f, setF] = useState({ brands: [] as string[], net: "Any", maxCash: 40000, maxMonthly: 4000, storage: "Any" });
  const t = q.trim().toLowerCase();
  const list = useMemo(() => {
    const l = products.filter((p) => (c === "All" || p.category === c)
      && (!t || [p.name, p.brand, p.category].join(" ").toLowerCase().includes(t))
      && (!f.brands.length || f.brands.includes(p.brand))
      && (f.net === "Any" || p.network === f.net)
      && (f.storage === "Any" || p.storage === f.storage)
      && (mode === "cash" ? p.cash <= f.maxCash : fromMonthly(p) <= f.maxMonthly));
    const price = (p: (typeof l)[number]) => (mode === "cash" ? p.cash : fromMonthly(p));
    return sort === "new" ? [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)) : [...l].sort((a, b) => (sort === "low" ? price(a) - price(b) : price(b) - price(a)));
  }, [c, t, f, sort, mode]);
  const services = t ? bundles.filter((b) => (b.name + " aweh giga esim data bundle").toLowerCase().includes(t)) : [];
  const suggestions = t ? [...new Set([...products.map((p) => p.name), ...brands, ...bundles.map((b) => b.name)])].filter((x) => x.toLowerCase().includes(t)).slice(0, 5) : [];
  const commit = (v: string) => { setQ(v); setFocus(false); if (v.trim()) setExtra((e) => ({ ...e, searches: [v, ...e.searches.filter((x) => x !== v)].slice(0, 6) })); };
  const activeCount = f.brands.length + (f.net !== "Any" ? 1 : 0) + (f.storage !== "Any" ? 1 : 0) + (f.maxCash < 40000 || f.maxMonthly < 4000 ? 1 : 0);
  return (
    <Shell>
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-mint">Pocket Market collection</p><h1 className="text-3xl font-bold">Shop</h1></div><PriceToggle /></div>
        <div className="mt-4 flex items-center justify-between gap-2 rounded-[20px] bg-primary px-4 py-3 text-primary-foreground"><div><p className="font-semibold">Not sure which contract fits?</p><p className="text-xs text-primary-foreground/70">Start with your monthly budget.</p></div><Link to="/find" className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary">Find my plan</Link></div>
        <div className="relative mt-5">
          <label className="flex items-center gap-3 rounded-2xl bg-card px-4"><Search className="size-4 text-muted-foreground" />
            <input value={q} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} onKeyDown={(e) => e.key === "Enter" && commit(q)} onChange={(e) => setQ(e.target.value)} placeholder='Try "iPhone 15", "Samsung" or "Aweh"' className="h-12 flex-1 bg-transparent text-sm outline-none" />
            {q && <button aria-label="Clear search" onClick={() => setQ("")}><X className="size-4 text-muted-foreground" /></button>}</label>
          {focus && (suggestions.length > 0 || (!t && extra.searches.length > 0)) && (
            <div className="absolute inset-x-0 top-14 z-30 rounded-2xl border bg-card p-2 shadow-xl">
              {!t && <p className="px-2 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">Recent</p>}
              {(t ? suggestions : extra.searches).map((s) => <button key={s} onMouseDown={() => commit(s)} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm hover:bg-surface-2">{t ? <Search className="size-3.5 text-muted-foreground" /> : <Clock className="size-3.5 text-muted-foreground" />}{s}</button>)}
            </div>)}
        </div>
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {all.map((n) => <button key={n} onClick={() => nav({ search: n === "All" ? {} : { c: n } })} className={"shrink-0 rounded-full px-4 py-2 text-sm font-medium " + (c === n ? "bg-mint text-mint-foreground" : "bg-card text-muted-foreground")}>{n}</button>)}
      </div>
      <div className="mt-4 flex items-center gap-2 px-5">
        <button onClick={() => setShowF(!showF)} className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-xs font-semibold"><SlidersHorizontal className="size-3.5" />Filters{activeCount > 0 && <span className="rounded-full bg-mint px-1.5 text-mint-foreground">{activeCount}</span>}</button>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-full bg-card px-3 py-2 text-xs font-semibold outline-none">
          {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <div className="ml-auto flex rounded-full bg-card p-1">
          {([["grid", LayoutGrid], ["list", List]] as const).map(([v, I]) => <button key={v} aria-label={v + " view"} onClick={() => setView(v)} className={cn("rounded-full p-1.5", view === v ? "bg-mint text-mint-foreground" : "text-muted-foreground")}><I className="size-4" /></button>)}
        </div>
      </div>
      {showF && (
        <div className="mx-5 mt-3 space-y-4 rounded-[20px] bg-card shadow-card p-4 text-sm">
          <div><p className="mb-2 text-xs text-muted-foreground">Brand</p><div className="flex flex-wrap gap-2">{brands.map((b) => <button key={b} onClick={() => setF({ ...f, brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b] })} className={cn("rounded-full border px-3 py-1 text-xs", f.brands.includes(b) ? "border-mint text-mint" : "text-muted-foreground")}>{b}</button>)}</div></div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">Network<select value={f.net} onChange={(e) => setF({ ...f, net: e.target.value })} className="mt-1 h-9 w-full rounded-xl bg-surface-2 px-2 text-foreground outline-none">{["Any", "5G", "4G"].map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs text-muted-foreground">Storage<select value={f.storage} onChange={(e) => setF({ ...f, storage: e.target.value })} className="mt-1 h-9 w-full rounded-xl bg-surface-2 px-2 text-foreground outline-none">{["Any", "64 GB", "128 GB", "256 GB", "512 GB"].map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          {mode === "cash"
            ? <label className="block text-xs text-muted-foreground">Max cash price: <span className="text-foreground">{nad(f.maxCash)}</span><input type="range" min={1000} max={40000} step={500} value={f.maxCash} onChange={(e) => setF({ ...f, maxCash: +e.target.value })} className="mt-2 w-full accent-[var(--mint)]" /></label>
            : <label className="block text-xs text-muted-foreground">Monthly budget: <span className="text-foreground">{nad(f.maxMonthly)}/mo</span><input type="range" min={200} max={4000} step={50} value={f.maxMonthly} onChange={(e) => setF({ ...f, maxMonthly: +e.target.value })} className="mt-2 w-full accent-[var(--mint)]" /></label>}
          <button onClick={() => setF({ brands: [], net: "Any", maxCash: 40000, maxMonthly: 4000, storage: "Any" })} className="text-xs text-mint">Reset filters</button>
        </div>)}
      {services.length > 0 && (
        <div className="px-5 pt-5"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mint">Services</p>
          <div className="space-y-2">{services.map((b) => <div key={b.id} className="flex items-center gap-3 rounded-[20px] bg-card shadow-card p-3"><Wifi className="size-5 text-mint" /><div className="flex-1"><p className="text-sm font-semibold">{b.name}</p><p className="text-xs text-muted-foreground">{b.data} · {b.validity}</p></div>
            <button onClick={() => add({ id: b.id, name: b.name, variant: b.id === "esim" ? "eSIM · QR delivery" : "Data bundle", price: b.price, kind: "digital" })} className="flex items-center gap-1 rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-mint-foreground"><Plus className="size-3" />{nad(b.price)}</button></div>)}</div></div>)}
      <p className="px-5 pt-4 text-xs text-muted-foreground">{list.length} product{list.length !== 1 && "s"}{mode === "contract" ? " · monthly values are illustrative" : ""}</p>
      {view === "grid" ? <div className="grid grid-cols-2 gap-3 px-5 pt-2">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : (
        <div className="space-y-2 px-5 pt-2">{list.map((p) => { const st = stockLabel(p); return (
          <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="flex items-center gap-3 rounded-[20px] bg-card shadow-card p-3">
            <img src={p.image} alt={p.name} loading="lazy" className="size-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand} · {p.network !== "None" ? p.network : p.category}{p.storage && ` · ${p.storage}`}</p><p className={cn("text-[11px]", st.tone === "ok" ? "text-mint" : st.tone === "low" ? "text-warning" : "text-primary")}>{st.text}</p></div>
            <p className="text-sm font-bold">{mode === "cash" ? nad(p.cash) : nad(fromMonthly(p)) + "/mo"}</p>
          </Link>); })}</div>)}
      {!list.length && <p className="py-16 text-center text-muted-foreground">No devices match. Try clearing filters.</p>}
    </Shell>
  );
}
