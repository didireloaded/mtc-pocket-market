import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Shell, PriceToggle } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

const all = ["All", "Phones", "Headphones", "Laptops", "Wearables", "Audio"];
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { c?: string } => (typeof s["c"] === "string" ? { c: s["c"] } : {}),
  head: () => ({ meta: [{ title: "Shop Devices — MTC Store" }, { name: "description", content: "Browse the full MTC catalog of phones, laptops, wearables and audio with cash or contract prices." }, { property: "og:title", content: "Shop Devices — MTC Store" }, { property: "og:description", content: "Browse the full MTC catalog of phones, laptops, wearables and audio with cash or contract prices." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Shop,
});
function Shop() {
  const { c = "All" } = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const [q, setQ] = useState("");
  const list = products.filter((p) => (c === "All" || p.category === c) && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Shell>
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-mint">Spectra Collection</p><h1 className="text-3xl font-bold">Shop</h1></div><PriceToggle /></div>
        <label className="mt-5 flex items-center gap-3 rounded-2xl bg-card px-4"><Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search devices" className="h-12 flex-1 bg-transparent text-sm outline-none" /></label>
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {all.map((n) => <button key={n} onClick={() => nav({ search: n === "All" ? {} : { c: n } })} className={"shrink-0 rounded-full px-4 py-2 text-sm font-medium " + (c === n ? "bg-mint text-mint-foreground" : "bg-card text-muted-foreground")}>{n}</button>)}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {!list.length && <p className="py-16 text-center text-muted-foreground">No devices found.</p>}
    </Shell>
  );
}
