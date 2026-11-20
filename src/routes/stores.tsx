import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, MapPin, Phone, Navigation, Clock } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/stores")({
  head: () => ({ meta: [{ title: "Find an MTC Store — MTC Store" }, { name: "description", content: "Search MTC Mobile Homes across Namibia for hours, phone numbers and directions." }, { property: "og:title", content: "Find an MTC Store" }, { property: "og:description", content: "Search MTC Mobile Homes across Namibia for hours, phone numbers and directions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Stores,
});
const stores = [
  { id: "wdh", name: "MTC Mobile Home Maerua", town: "Windhoek", region: "Khomas", address: "Maerua Mall, Jan Jonker Rd", phone: "+264612802000", hours: "Mon–Fri 9:00–18:00 · Sat 9:00–14:00", lat: -22.5826, lng: 17.0918, services: ["eSIM", "Contracts", "Repairs"] },
  { id: "wdh2", name: "MTC Mobile Home Wernhil", town: "Windhoek", region: "Khomas", address: "Wernhil Park, Mandume Ndemufayo Ave", phone: "+264612802100", hours: "Mon–Fri 9:00–18:00 · Sat 9:00–14:00", lat: -22.5667, lng: 17.0806, services: ["eSIM", "Contracts"] },
  { id: "swk", name: "MTC Swakopmund", town: "Swakopmund", region: "Erongo", address: "Platz am Meer Mall", phone: "+264644100200", hours: "Mon–Fri 9:00–17:30 · Sat 9:00–13:00", lat: -22.6512, lng: 14.5262, services: ["eSIM", "Contracts"] },
  { id: "wvb", name: "MTC Walvis Bay", town: "Walvis Bay", region: "Erongo", address: "Dunes Mall, 13th Rd", phone: "+264642100300", hours: "Mon–Fri 9:00–17:30 · Sat 9:00–13:00", lat: -22.9591, lng: 14.5093, services: ["eSIM", "Repairs"] },
  { id: "osh", name: "MTC Oshakati", town: "Oshakati", region: "Oshana", address: "Oshakati Mall, Main Rd", phone: "+264652200400", hours: "Mon–Fri 8:30–17:30 · Sat 9:00–13:00", lat: -17.7883, lng: 15.6995, services: ["eSIM", "Contracts", "Repairs"] },
  { id: "rnd", name: "MTC Rundu", town: "Rundu", region: "Kavango East", address: "Rundu Shopping Centre", phone: "+264662500500", hours: "Mon–Fri 8:30–17:00 · Sat 9:00–12:30", lat: -17.9186, lng: 19.7731, services: ["Contracts"] },
  { id: "ksh", name: "MTC Keetmanshoop", town: "Keetmanshoop", region: "ǁKaras", address: "Hampie Plichta Ave", phone: "+264632200600", hours: "Mon–Fri 8:30–17:00 · Sat 9:00–12:30", lat: -26.5833, lng: 18.1333, services: ["eSIM"] },
  { id: "kat", name: "MTC Katima Mulilo", town: "Katima Mulilo", region: "Zambezi", address: "Katima Shopping Mall", phone: "+264662600700", hours: "Mon–Fri 8:30–17:00 · Sat 9:00–12:30", lat: -17.5, lng: 24.2667, services: ["eSIM", "Contracts"] },
];
function Stores() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const t = q.toLowerCase();
  const list = stores.filter((s) => [s.name, s.town, s.region, s.address, ...s.services].join(" ").toLowerCase().includes(t));
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/mymtc" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="mt-5 text-3xl font-bold">Find a store</h1>
        <label className="mt-4 flex items-center gap-3 rounded-2xl bg-card px-4"><Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Town, region or service" className="h-12 flex-1 bg-transparent text-sm outline-none" /></label>
        <p className="mt-3 text-xs text-muted-foreground">{list.length} store{list.length !== 1 && "s"} found</p>
        <div className="mt-3 space-y-3">
          {list.map((s) => (
            <div key={s.id} className="rounded-[20px] bg-card p-4">
              <button onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full items-start gap-3 text-left">
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary"><MapPin className="size-5" /></div>
                <div className="flex-1"><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.town}, {s.region}</p></div>
              </button>
              {open === s.id && (
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">{s.address}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" />{s.hours}</p>
                  <div className="flex flex-wrap gap-1">{s.services.map((x) => <span key={x} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">{x}</span>)}</div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a href={`tel:${s.phone}`} className="flex h-11 items-center justify-center gap-2 rounded-2xl border font-semibold"><Phone className="size-4" />Call</a>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-mint font-semibold text-mint-foreground"><Navigation className="size-4" />Directions</a>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!list.length && <p className="py-10 text-center text-muted-foreground">No stores match "{q}".</p>}
        </div>
      </div>
    </Shell>
  );
}
