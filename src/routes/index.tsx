import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Plus, Headphones, Laptop, Watch, Speaker, Wifi } from "lucide-react";
import { Shell, PriceToggle } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, nad } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "MTC Store — Premium Devices & Data" }, { name: "description", content: "Discover headphones, laptops, wearables and audio from MTC Namibia, with cash or contract pricing." }, { property: "og:title", content: "MTC Store — Premium Devices & Data" }, { property: "og:description", content: "Discover headphones, laptops, wearables and audio from MTC Namibia, with cash or contract pricing." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});
const cats = [{ n: "Headphones", i: Headphones }, { n: "Laptops", i: Laptop }, { n: "Wearables", i: Watch }, { n: "Audio", i: Speaker }] as const;

function Home() {
  const { user, mode, add, setAuthOpen } = useStore();
  const hero = products.find((p) => p.featured)!;
  const h = new Date().getHours();
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-sm text-muted-foreground">{h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}</p>
          <h1 className="text-2xl font-bold">{user ? "Hi, +264 " + user.phone.slice(0, 2) + "•••" : <button onClick={() => setAuthOpen(true)}>Welcome, Guest</button>}</h1>
        </div>
        <button aria-label="Notifications" className="relative grid size-11 place-items-center rounded-full bg-card"><Bell className="size-5" /><span className="absolute right-3 top-3 size-2 rounded-full bg-primary" /></button>
      </header>
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-5">
        {cats.map(({ n, i: I }, idx) => (
          <Link key={n} to="/shop" search={{ c: n }} className={"flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium " + (idx === 0 ? "bg-mint text-mint-foreground" : "bg-card text-muted-foreground")}><I className="size-4" />{n}</Link>
        ))}
      </div>
      <section className="px-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-card">
          <Link to="/product/$id" params={{ id: hero.id }}>
            <img src={hero.image} alt={hero.name} className="h-72 w-full object-cover" />
            <div className="absolute inset-0 fade-bottom" />
            <span className="absolute left-4 top-4 rounded-full bg-mint px-3 py-1 text-[11px] font-bold text-mint-foreground">FEATURED</span>
            <div className="absolute bottom-5 left-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{hero.tagline}</p>
              <h2 className="text-3xl font-extrabold">{hero.name}</h2>
              <p className="mt-1 text-lg font-semibold">{mode === "cash" ? nad(hero.cash) : nad(hero.contract) + "/mo"}</p>
            </div>
          </Link>
          <button aria-label="Add to cart" onClick={() => add({ id: hero.id, name: hero.name, image: hero.image, variant: hero.colors[0]!, price: mode === "cash" ? hero.cash : hero.contract, kind: "physical", mode })}
            className="absolute bottom-5 right-5 grid size-14 place-items-center rounded-full bg-mint text-mint-foreground glow-mint"><Plus className="size-6" /></button>
        </div>
        <div className="mt-4 flex justify-center"><PriceToggle /></div>
      </section>
      <section className="pt-8">
        <div className="flex items-end justify-between px-5">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-mint">New Arrival</p><h3 className="text-xl font-bold">The Creator Series</h3></div>
          <Link to="/shop" className="text-sm text-muted-foreground">See all</Link>
        </div>
        <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto px-5">
          {products.filter((p) => p.isNew).map((p) => <div key={p.id} className="w-44 shrink-0 snap-start"><ProductCard p={p} /></div>)}
        </div>
      </section>
      <section className="px-5 pt-8">
        <Link to="/esim" className="flex items-center gap-4 rounded-[20px] border border-mint/30 bg-card p-5">
          <div className="grid size-12 place-items-center rounded-2xl bg-mint/15 text-mint"><Wifi /></div>
          <div className="flex-1"><p className="font-semibold">Get an eSIM in minutes</p><p className="text-sm text-muted-foreground">Scan a QR, you're connected.</p></div>
          <span className="text-mint">→</span>
        </Link>
      </section>
    </Shell>
  );
}
