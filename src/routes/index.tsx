import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, Smartphone, Tablet, Plus, Laptop, Watch, Router, Cable, Wifi } from "lucide-react";
import { Shell, PriceToggle } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, nad, fromMonthly, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "MTC Store — Premium Devices & Data" }, { name: "description", content: "Discover headphones, laptops, wearables and audio from MTC Namibia, with cash or contract pricing." }, { property: "og:title", content: "MTC Store — Premium Devices & Data" }, { property: "og:description", content: "Discover headphones, laptops, wearables and audio from MTC Namibia, with cash or contract pricing." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});
const cats = [{ n: "Phones", i: Smartphone }, { n: "Laptops", i: Laptop }, { n: "Tablets", i: Tablet }, { n: "Wearables", i: Watch }, { n: "Data devices", i: Router }, { n: "Accessories", i: Cable }] as const;

function Home() {
  const { user, mode, add, setAuthOpen, notices, extra } = useStore();
  const recent = extra.recent.map(getProduct).filter((p) => !!p);
  const unread = notices.filter((n) => !n.read).length;
  const hero = products.find((p) => p.featured)!;
  const h = new Date().getHours();
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 pt-8">
        <div>
          <p className="text-sm text-muted-foreground">{h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}</p>
          <h1 className="text-2xl font-bold">{user ? "Hi, " + (user.method === "email" ? user.label.split("@")[0] : user.label) : <button onClick={() => setAuthOpen(true)}>Welcome, Guest</button>}</h1>
        </div>
        <Link to="/notifications" aria-label="Notifications" className="relative grid size-11 place-items-center rounded-full bg-card"><Bell className="size-5" />{unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-brand-red text-[10px] font-bold text-primary-foreground">{unread}</span>}</Link>
      </header>
      <Link to="/shop" className="mx-5 mt-5 flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 text-sm text-muted-foreground"><Search className="size-4" />Search devices, brands or "Aweh"</Link>
      <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5">
        {[{ t: "Laptops on contract", d: "MacBook on Select plans, 12–36 months", c: "bg-primary text-primary-foreground", to: "/shop" as const }, { t: "Galaxy S26 is here", d: "N$21,999 cash or on contract", c: "bg-mint text-mint-foreground", to: "/shop" as const }, { t: "Travel eSIM", d: "10 GB for N$199", c: "bg-surface-2 text-foreground", to: "/esim" as const }].map((b) => (
          <Link key={b.t} to={b.to} className={"w-64 shrink-0 snap-start rounded-[20px] p-4 " + b.c}><p className="text-lg font-extrabold">{b.t}</p><p className="text-sm opacity-80">{b.d}</p></Link>))}
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {cats.map(({ n, i: I }, idx) => (
          <Link key={n} to="/shop" search={{ c: n }} className={"flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium " + (idx === 0 ? "bg-mint text-mint-foreground" : "bg-card text-muted-foreground")}><I className="size-4" />{n}</Link>
        ))}
      </div>
      <section className="px-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-card">
          <Link to="/product/$id" params={{ id: hero.id }} className="block">
            <div className="relative h-64 w-full bg-stage p-6"><img src={hero.image} alt={hero.name} className="size-full object-contain" />
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase text-primary-foreground">Featured</span></div>
            <div className="p-5 pr-24">
              <p className="text-xs uppercase tracking-widest text-mint">{hero.badge ?? hero.category}</p>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight">{hero.name}</h2>
              <p className="mt-1 text-lg font-semibold">{mode === "cash" ? nad(hero.cash) : "from " + nad(fromMonthly(hero)) + "/mo"}</p>
            </div>
          </Link>
          <button aria-label="Add to cart" onClick={() => add({ id: hero.id, name: hero.name, image: hero.image, variant: hero.colors[0]!, price: hero.cash, kind: "physical", mode: "cash" })}
            className="absolute bottom-5 right-5 grid size-14 place-items-center rounded-full bg-mint text-mint-foreground glow-mint"><Plus className="size-6" /></button>
        </div>
        <div className="mt-4 flex justify-center"><PriceToggle /></div>
      </section>
      <section className="pt-8">
        <div className="flex items-end justify-between px-5">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-mint">New Arrival</p><h3 className="text-xl font-bold">Just landed at MTC</h3></div>
          <Link to="/shop" className="text-sm text-muted-foreground">See all</Link>
        </div>
        <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto px-5">
          {products.filter((p) => p.isNew).map((p) => <div key={p.id} className="w-44 shrink-0 snap-start"><ProductCard p={p} /></div>)}
        </div>
      </section>
      {recent.length > 0 && <section className="pt-8"><h3 className="px-5 text-xl font-bold">Recently viewed</h3>
        <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-5">{recent.map((p) => <div key={p.id} className="w-40 shrink-0"><ProductCard p={p} /></div>)}</div></section>}
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
