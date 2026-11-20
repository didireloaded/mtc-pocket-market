import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, MapPin, Info, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { MTC_STORES } from "@/lib/data";

export const Route = createFileRoute("/stores")({
  head: () => ({ meta: [
    { title: "MTC collection locations — Pocket Market" },
    { name: "description", content: "Browse MTC collection-location names from the product catalogue. Confirm opening hours and stock with MTC." },
    { property: "og:title", content: "MTC collection locations" },
    { property: "og:type", content: "website" },
  ] }),
  component: Stores,
});

function Stores() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const visible = useMemo(() => MTC_STORES.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <Link to="/" aria-label="Back to Home" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-mint">Retail meets digital</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Find a collection location.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Explore the collection location names in MTC's current product catalogue.</p>
        <div className="mt-5 flex gap-3 rounded-[20px] border border-[#90B2CC]/40 bg-[#E4EFF8] p-4 text-[#1D4666]">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p className="text-xs leading-5">This is a concept directory, not a live branch inventory system. Store addresses, hours, reservation slots and product availability must be confirmed with MTC before visiting.</p>
        </div>
        <label className="mt-6 flex h-14 items-center gap-3 rounded-full bg-card px-5">
          <Search className="size-5 text-mint" />
          <input aria-label="Search collection locations" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by town or branch" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <p className="mt-5 text-xs text-muted-foreground">{visible.length} locations in this list</p>
        <div className="mt-3 space-y-2">
          {visible.map((name) => <div key={name} className="rounded-[20px] bg-card p-4 shadow-card">
            <button onClick={() => setSelected(selected === name ? null : name)} aria-expanded={selected === name} className="flex w-full items-center gap-3 text-left">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2"><MapPin className="size-5 text-mint" /></span>
              <span className="flex-1 text-sm font-semibold">{name}</span>
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </button>
            {selected === name && <div className="mt-3 border-t pt-3 text-xs leading-5 text-muted-foreground">
              Collection and reservation features for this branch will become available after stock and store-service integration. Please confirm details directly with MTC.
            </div>}
          </div>)}
          {!visible.length && <p className="rounded-[20px] bg-card p-6 text-center text-sm text-muted-foreground">No location matches your search.</p>}
        </div>
        <a href="https://www.mtc.com.na" target="_blank" rel="noreferrer" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold">Visit official MTC website <ArrowUpRight className="size-4" /></a>
      </div>
    </Shell>
  );
}
