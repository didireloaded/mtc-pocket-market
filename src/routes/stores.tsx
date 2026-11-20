import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, MapPin, Navigation, Phone, ExternalLink, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { nearbyLocations, directionsUrl, type Coordinates } from "@/lib/locations";

export const Route = createFileRoute("/stores")({
  head: () => ({ meta: [{ title: "MTC Store Locator — Find Your Nearest Shop" }, { name: "description", content: "Find official MTC Namibia retail addresses, phone numbers, opening hours and nearby shops." }, { property: "og:title", content: "MTC Store Locator" }, { property: "og:description", content: "Locate MTC shops with official addresses and distance from your location." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Stores,
});
function Stores() {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const visible = useMemo(() => nearbyLocations(query, origin), [query, origin]);
  const locate = () => {
    if (!navigator.geolocation) { setError("Location is unavailable. Search by town instead."); return; }
    setBusy(true); setError("");
    navigator.geolocation.getCurrentPosition((p) => { setOrigin({ lat: p.coords.latitude, lng: p.coords.longitude }); setBusy(false); }, () => { setError("Could not get your location. Allow location access or search by town."); setBusy(false); }, { timeout: 15000, maximumAge: 60000 });
  };
  return <Shell><div className="px-5 pt-6 pb-10">
    <Button asChild variant="secondary" size="icon" className="size-11 rounded-full"><Link to="/mymtc" aria-label="Back to MyMTC"><ArrowLeft className="size-5" /></Link></Button>
    <p className="mt-7 text-xs font-semibold uppercase text-mint">MTC Namibia</p><h1 className="mt-2 text-3xl font-bold">Find a store</h1>
    <label className="mt-5 flex h-14 items-center gap-3 rounded-full bg-card px-5"><Search className="size-5 text-muted-foreground" /><input aria-label="Search stores" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Town, branch or street" className="min-w-0 w-full bg-transparent text-sm outline-none" /></label>
    <Button onClick={locate} disabled={busy} variant="outline" className="mt-3 h-12 w-full rounded-full bg-card">{busy ? <Loader2 className="size-4 animate-spin" /> : <Navigation className="size-4" />}{busy ? "Finding your location…" : origin ? "Update my location" : "Find nearest stores"}</Button>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <p className="mt-5 text-xs text-muted-foreground">{visible.length} stores{origin ? " · nearest first · straight-line distances" : " · official MTC directory"}</p>
    <div className="mt-3 space-y-3">{visible.map((s) => <article key={s.id} className="rounded-[20px] bg-card p-4 shadow-card">
      <div className="flex items-start gap-3"><MapPin className="mt-1 size-5 shrink-0 text-mint" /><div className="min-w-0 flex-1"><h2 className="font-semibold">{s.name}</h2><p className="text-xs text-muted-foreground">{s.town}</p></div>{origin && <span className="shrink-0 text-xs font-semibold text-mint">{s.distance === null ? "Distance unavailable" : `${s.distance.toFixed(1)} km`}</span>}</div>
      <p className="mt-3 text-sm leading-5">{s.address}</p>
      <details className="mt-3 text-xs"><summary className="cursor-pointer text-muted-foreground">Opening hours</summary><ul className="mt-2 space-y-1">{s.hours.map((h) => <li key={h}>{h}</li>)}</ul></details>
      <div className="mt-4 flex gap-2"><Button asChild className="h-11 flex-1 rounded-full text-xs"><a href={directionsUrl(s)} target="_blank" rel="noreferrer"><Navigation className="size-4" />Directions</a></Button>{s.phone && <Button asChild variant="outline" className="h-11 flex-1 rounded-full text-xs"><a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}><Phone className="size-4" />Call</a></Button>}</div>
      <a className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground" href={s.source} target="_blank" rel="noreferrer">MTC listing <ExternalLink className="size-3" /></a>
    </article>)}</div>{!visible.length && <p className="py-10 text-center text-muted-foreground">No stores match your search.</p>}
    <p className="mt-6 text-xs leading-5 text-muted-foreground">Addresses and hours from MTC’s official directory, checked 20 November 2026. Confirm holiday hours and stock before visiting. Distances use MTC’s published map locations, not driving distance.</p>
  </div></Shell>;
}