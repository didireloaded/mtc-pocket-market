import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, ShoppingBag, ArrowUpRight, ArrowRight, Smartphone, Laptop, Tablet, Watch, Router, Cable, SlidersHorizontal, Wifi, MapPin, Bookmark } from "lucide-react";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, nad, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MTC Pocket Market — Devices, contracts and services" },
    { name: "description", content: "Discover devices, explore contracts, and manage your shopping journey in one place." },
    { property: "og:title", content: "MTC Pocket Market" },
    { property: "og:description", content: "A connected mobile retail experience for Namibia." },
    { property: "og:type", content: "website" },
  ] }),
  component: Home,
});

const categories = [
  { name: "Phones", Icon: Smartphone },
  { name: "Laptops", Icon: Laptop },
  { name: "Tablets", Icon: Tablet },
  { name: "Wearables", Icon: Watch },
  { name: "Data devices", Icon: Router },
  { name: "Accessories", Icon: Cable },
] as const;

function Home() {
  const { user, extra, saved, cart, notices, setAuthOpen } = useStore();
  const featured = products.find((p) => p.featured) ?? products[0]!;
  const recent = extra.recent.map(getProduct).filter((p) => !!p).slice(0, 5);
  const favorites = saved.map(getProduct).filter((p) => !!p).slice(0, 4);
  const unread = notices.filter((n) => !n.read).length;
  const bagCount = cart.reduce((count, item) => count + item.qty, 0);
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.label?.split("@")[0]?.split(/[ ._-]/)[0];
  return (
    <Shell>
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mint">MTC Pocket Market</p>
            <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight">{user ? `${greeting}, ${firstName || "there"}.` : "Find your next connection."}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user ? "Your shopping, all in one place." : "Explore devices and plans without signing in."}</p>
          </div>
          <div className="flex shrink-0 gap-2 pl-2">
            <Link to="/notifications" aria-label="Notifications" className="relative grid size-11 place-items-center rounded-full bg-card">
              <Bell className="size-[19px]" />
              {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-brand-red text-[10px] font-bold text-white">{unread}</span>}
            </Link>
            <Link to="/cart" aria-label={`Shopping bag with ${bagCount} items`} className="relative grid size-11 place-items-center rounded-full bg-card">
              <ShoppingBag className="size-[19px]" />
              {bagCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{bagCount}</span>}
            </Link>
          </div>
        </div>

        <Link to="/shop" className="mt-6 flex h-14 items-center gap-3 rounded-full bg-card px-5 text-sm text-muted-foreground shadow-card">
          <Search className="size-5 text-foreground" />
          <span className="flex-1">Search phones, laptops, plans...</span>
          <ArrowUpRight className="size-4" />
        </Link>

        {user ? (
          <div className="mt-5 rounded-[22px] border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-semibold">Your MTC experience</p><p className="mt-1 max-w-[240px] text-xs leading-5 text-muted-foreground">You're signed in to Pocket Market. Network balances and contracts need a verified MTC account connection.</p></div>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">Not linked</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/orders" className="flex-1 rounded-full bg-primary px-3 py-3 text-center text-xs font-semibold text-primary-foreground">My orders</Link>
              <Link to="/mymtc" className="flex-1 rounded-full bg-surface-2 px-3 py-3 text-center text-xs font-semibold">Explore My MTC</Link>
            </div>
          </div>
        ) : (
          <button onClick={() => setAuthOpen(true)} className="mt-5 flex w-full items-center justify-between rounded-[20px] border bg-card px-4 py-3 text-left">
            <span><span className="block text-sm font-semibold">Already an MTC customer?</span><span className="block text-xs text-muted-foreground">Sign in to save your shopping journey.</span></span>
            <ArrowRight className="size-5 text-mint" />
          </button>
        )}
      </div>

      <section className="mt-6 px-5">
        <div className="relative min-h-[210px] overflow-hidden rounded-[26px] bg-[#DDEBF7]">
          <div className="relative z-10 flex min-h-[210px] w-[63%] flex-col items-start justify-between p-5">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#235C89]">Device spotlight</p>
              <h2 className="mt-2 text-[22px] font-bold leading-[1.1] tracking-tight text-[#152D43]">{featured.name}</h2>
              <p className="mt-2 text-sm font-semibold text-[#235C89]">Outright {nad(featured.cash)}</p></div>
            <Link to="/product/$id" params={{ id: featured.id }} className="inline-flex items-center gap-2 rounded-full bg-[#152D43] px-4 py-2.5 text-xs font-semibold text-white">
              Explore device <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <img src={featured.image} alt={featured.name} className="absolute -right-3 bottom-0 h-[92%] w-[49%] object-contain" />
        </div>
      </section>

      <section className="mt-6 px-5">
        <Link to="/find" className="flex items-center gap-4 rounded-[24px] bg-primary p-5 text-primary-foreground">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15"><SlidersHorizontal className="size-6" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/65">Find my contract</p>
            <h2 className="mt-0.5 text-lg font-bold leading-6">Start with your budget.</h2>
            <p className="mt-1 text-xs text-white/70">Compare devices and plans in a few steps.</p>
          </div>
          <ArrowUpRight className="size-5 shrink-0" />
        </Link>
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between px-5"><h2 className="text-lg font-bold">Shop by category</h2><Link to="/shop" className="text-xs font-semibold text-mint">View all</Link></div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {categories.map(({ name, Icon }) => {
            const photo = products.find((p) => p.category === name)?.image;
            return <Link key={name} to="/shop" search={{ c: name }} className="flex w-[76px] shrink-0 flex-col items-center gap-2 text-center">
              <div className="grid size-[72px] place-items-center rounded-[20px] bg-card p-2 shadow-card">{photo ? <img src={photo} alt="" loading="lazy" className="size-full object-contain" /> : <Icon className="size-6 text-mint" />}</div>
              <span className="text-[11px] font-medium leading-4">{name}</span>
            </Link>;
          })}
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/shop" search={{ c: "Data devices" }} className="rounded-[22px] bg-card p-4 shadow-card">
            <Wifi className="size-6 text-mint" />
            <p className="mt-5 text-sm font-bold">Stay connected</p>
            <p className="mt-1 text-xs text-muted-foreground">Explore internet devices</p>
          </Link>
          <Link to="/stores" className="rounded-[22px] bg-card p-4 shadow-card">
            <MapPin className="size-6 text-mint" />
            <p className="mt-5 text-sm font-bold">Find an MTC store</p>
            <p className="mt-1 text-xs text-muted-foreground">See branch locations</p>
          </Link>
        </div>
      </section>

      {favorites.length > 0 && <section className="mt-7">
        <div className="flex items-center gap-2 px-5"><Bookmark className="size-4 text-mint" /><h2 className="text-lg font-bold">Saved for later</h2></div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">{favorites.map((p) => <div key={p.id} className="w-40 shrink-0"><ProductCard p={p} /></div>)}</div>
      </section>}

      <section className="mt-7">
        <div className="flex items-center justify-between px-5"><h2 className="text-lg font-bold">{recent.length ? "Continue exploring" : "New arrivals"}</h2><Link to="/shop" className="text-xs font-semibold text-mint">Browse all</Link></div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
          {(recent.length ? recent : products.filter((p) => p.isNew)).slice(0, 6).map((p) => <div key={p.id} className="w-40 shrink-0"><ProductCard p={p} /></div>)}
        </div>
      </section>
      <p className="px-6 pb-8 pt-7 text-center text-[11px] leading-5 text-muted-foreground">Independent MTC retail concept. Services, stock and contract prices require official verification.</p>
    </Shell>
  );
}
