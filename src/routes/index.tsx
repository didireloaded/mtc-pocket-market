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
          <h1 className="text-[28px] font-bold tracking-tight">{user ? "Hi, " + (user.method === "email" ? user.label.split("@")[0] : user.label) + "!" : <button onClick={() => setAuthOpen(true)}>Hi there!</button>}</h1>
          <p className="mt-0.5 text-muted-foreground">{h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"} · discover devices you'll love</p>
        </div>
        <Link to="/notifications" aria-label="Notifications" className="relative grid size-12 place-items-center rounded-full bg-card shadow-card"><Bell className="size-5" />{unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-brand-red text-[10px] font-bold text-primary-foreground">{unread}</span>}</Link>
      </header>
      <Link to="/shop" className="mx-5 mt-5 flex items-center gap-3 rounded-full bg-card px-5 py-4 text-muted-foreground shadow-card"><Search className="size-5 text-foreground" />Search devices, brands or "Aweh"</Link>
      <section className="px-5 pt-5">
        <div className="relative flex h-48 overflow-hidden rounded-[24px] bg-stage">
          <div className="z-10 flex flex-col justify-between p-5">
            <div><p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{hero.badge ?? "Featured"}</p>
              <h2 className="mt-1 max-w-[11rem] text-xl font-bold leading-tight">{hero.name}</h2>
              <p className="mt-1 text-sm font-semibold text-mint">{mode === "cash" ? nad(hero.cash) : "from " + nad(fromMonthly(hero)) + "/mo"}</p></div>
            <Link to="/product/$id" params={{ id: hero.id }} className="w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Shop Now</Link>
          </div>
          <img src={hero.image} alt={hero.name} className="absolute -right-4 bottom-0 h-[92%] w-1/2 object-contain" />
          <button aria-label="Add to cart" onClick={() => add({ id: hero.id, name: hero.name, image: hero.image, variant: hero.colors[0]!, price: hero.cash, kind: "physical", mode: "cash" })}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card text-foreground shadow-card"><Plus className="size-5" /></button>
        </div>
        <div className="mt-3 flex justify-center"><PriceToggle /></div>
      </section>
      <section className="pt-6">
        <div className="flex items-center justify-between px-5"><h3 className="text-lg font-semibold">Shop by Category</h3><Link to="/shop" className="text-sm font-medium text-mint">View All</Link></div>
        <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto px-5">
          {cats.map(({ n }) => { const img = products.find((p) => p.category === n)?.image; return (
            <Link key={n} to="/shop" search={{ c: n }} className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-xs font-medium">
              <span className="grid size-16 place-items-center rounded-full bg-card shadow-card">{img && <img src={img} alt="" className="size-11 object-contain" />}</span>{n}</Link>); })}
        </div>
      </section>
      <section className="px-5 pt-6">
        <Link to="/compare/macbooks" className="flex items-center justify-between rounded-[20px] bg-card p-4 shadow-card"><div><p className="font-semibold">Laptops on contract</p><p className="text-sm text-muted-foreground">MacBook on Select plans, 12–36 months</p></div><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">→</span></Link>
      </section>
      <section className="pt-8">
        <div className="flex items-end justify-between px-5">
          <div><h3 className="text-lg font-semibold">New Arrivals</h3></div>
          <Link to="/shop" className="text-sm font-medium text-mint">View All</Link>
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
