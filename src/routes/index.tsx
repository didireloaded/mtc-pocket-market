import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Bell, Cable, Laptop, MapPin, MessageCircle, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Smartphone, Tablet, Watch, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/retail/RetailPrimitives";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, nad, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MTC Pocket Market — Devices, contracts and services" },
    { name: "description", content: "Discover devices and explore illustrative contract options in one mobile-first retail experience." },
    { property: "og:title", content: "MTC Pocket Market" },
    { property: "og:description", content: "Discover devices, compare prices and explore your next connection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
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
  const favourites = saved.map(getProduct).filter((p) => !!p).slice(0, 5);
  const unread = notices.filter((n) => !n.read).length;
  const bagCount = cart.reduce((count, item) => count + item.qty, 0);
  const firstName = user?.label?.split("@")[0]?.split(/[ ._-]/)[0];

  return (
    <Shell>
      <header className="px-5 pt-8">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow className="text-brand-red">MTC / POCKET MARKET</Eyebrow>
          <div className="flex items-center gap-1">
            <Link to="/notifications" aria-label="Notifications"
              className="relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2">
              <Bell aria-hidden="true" className="size-[21px]" strokeWidth={1.9} />
              {unread > 0 && <span aria-hidden="true" className="absolute right-1 top-1 size-2 rounded-full bg-brand-red" />}
            </Link>
            <Link to="/cart" aria-label={`Shopping bag with ${bagCount} items`}
              className="relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2">
              <ShoppingBag aria-hidden="true" className="size-[21px]" strokeWidth={1.9} />
              {bagCount > 0 && <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">{bagCount}</span>}
            </Link>
          </div>
        </div>
        <h1 className="mt-4 max-w-[340px] text-[31px] font-bold leading-[1.08] tracking-[-0.055em] text-foreground">
          {user ? `Welcome back, ${firstName || "there"}.` : "Find your next device."}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
          {user ? "Discover something new or pick up where you left off." : "Explore the right phone, laptop or plan for your budget."}
        </p>
        <Link to="/shop"
          className="mt-6 flex min-h-14 items-center gap-3 rounded-[13px] border border-border bg-white px-4 transition-colors hover:border-[#b8c3ca]">
          <Search aria-hidden="true" className="size-5 shrink-0 text-foreground" strokeWidth={1.9} />
          <span className="flex-1 text-[14px] text-muted-foreground">Search devices and accessories</span>
          <ArrowRight aria-hidden="true" className="size-4 text-foreground" />
        </Link>
        <Link to="/adviser" className="mt-3 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-mint">
          <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={1.9} /> Need help choosing? Ask the adviser
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </header>

      <section className="mt-5 px-5" aria-label="Featured product">
        <div className="relative isolate min-h-[260px] overflow-hidden rounded-[17px] bg-[#DDE8EF]">
          <div className="relative z-10 flex min-h-[260px] w-[64%] flex-col items-start p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#31546D]">Featured device</p>
            <h2 className="mt-3 text-[23px] font-bold leading-[1.1] tracking-[-0.045em] text-[#202E39]">{featured.name}</h2>
            <div className="mt-auto pt-4">
              <p className="text-[12px] text-[#3B576A]">Buy outright</p>
              <p className="mt-0.5 text-[22px] font-bold leading-7 tracking-tight tabular-nums text-[#202E39]">{nad(featured.cash)}</p>
              <Link to="/product/$id" params={{ id: featured.id }}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-[#DD2A1B] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#be2519]">
                View device <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
          <img src={featured.image} alt="" loading="eager" decoding="async"
            className="pointer-events-none absolute -right-4 bottom-0 h-[90%] w-[47%] object-contain" />
        </div>
      </section>

      <section className="retail-section" aria-labelledby="categories-heading">
        <div className="px-5"><h2 id="categories-heading" className="text-[21px] font-bold tracking-[-0.035em]">Shop by category</h2></div>
        <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-5 pb-2">
          {categories.map(({ name, Icon }) => {
            const image = products.find((product) => product.category === name)?.image;
            return <Link key={name} to="/shop" search={{ c: name }}
              className="flex w-[78px] shrink-0 flex-col items-center gap-2 text-center">
              <span className="grid size-[76px] place-items-center rounded-[13px] border border-border/70 bg-stage p-2">
                {image ? <img src={image} alt="" loading="lazy" decoding="async" className="size-full object-contain" />
                  : <Icon aria-hidden="true" className="size-6 text-foreground" strokeWidth={1.9} />}
              </span>
              <span className="text-[12px] font-medium leading-4 text-foreground">{name}</span>
            </Link>;
          })}
        </div>
      </section>

      <section className="retail-section border-y border-border bg-white px-5 py-7" aria-labelledby="contract-promo">
        <Eyebrow className="text-brand-red">FIND MY CONTRACT</Eyebrow>
        <h2 id="contract-promo" className="mt-2 max-w-[290px] text-[26px] font-bold leading-[1.13] tracking-[-0.05em]">
          Start with what you can afford.
        </h2>
        <p className="mt-2 max-w-[335px] text-[14px] leading-6 text-muted-foreground">
          Choose a monthly budget. Compare devices and illustrative plan options in one place.
        </p>
        <Button asChild className="mt-5 h-12 rounded-[12px] px-5 text-[14px] font-semibold">
          <Link to="/find">Find a contract <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Button>
      </section>

      <section className="retail-section px-5" aria-label="Helpful links">
        <Link to="/compare" className="flex min-h-[68px] items-center gap-3 border-b border-border py-3">
          <SlidersHorizontal aria-hidden="true" className="size-5 shrink-0 text-mint" strokeWidth={1.9} />
          <span className="flex-1 text-[15px] font-semibold">Compare two devices</span>
          <ArrowRight aria-hidden="true" className="size-[18px] text-foreground" />
        </Link>
        <Link to="/stores" className="flex min-h-[68px] items-center gap-3 border-b border-border py-3">
          <MapPin aria-hidden="true" className="size-5 shrink-0 text-mint" strokeWidth={1.9} />
          <span className="flex-1 text-[15px] font-semibold">Find an MTC location</span>
          <ArrowRight aria-hidden="true" className="size-[18px] text-foreground" />
        </Link>
        <Link to="/orders" className="flex min-h-[68px] items-center gap-3 border-b border-border py-3">
          <ShoppingBag aria-hidden="true" className="size-5 shrink-0 text-mint" strokeWidth={1.9} />
          <span className="flex-1 text-[15px] font-semibold">Orders and requests</span>
          <ArrowRight aria-hidden="true" className="size-[18px] text-foreground" />
        </Link>
      </section>

      {user ? (
        <section className="retail-section px-5">
          <div className="flex items-start gap-3 border-l-[3px] border-mint bg-white px-4 py-4">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-mint" strokeWidth={1.9} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">Your Pocket Market account</p>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">MTC mobile balances and contracts need an authorised account connection.</p>
              <Link to="/mymtc" className="mt-2 inline-flex min-h-9 items-center gap-1 text-[13px] font-semibold text-mint">
                Explore My MTC <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="retail-section px-5">
          <button type="button" onClick={() => setAuthOpen(true)}
            className="flex min-h-[70px] w-full items-center gap-3 border-y border-border py-3 text-left">
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">Have a Pocket Market account?</span>
              <span className="mt-1 block text-[13px] text-muted-foreground">Sign in to save your shopping journey.</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-mint" />
          </button>
        </section>
      )}

      {favourites.length > 0 && <section className="retail-section">
        <div className="px-5"><SectionHeading title="Saved for later" description="Devices you've bookmarked." /></div>
        <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-2">
          {favourites.map((p) => <div key={p.id} className="w-[174px] shrink-0 snap-start"><ProductCard p={p} /></div>)}
        </div>
      </section>}

      <section className="retail-section pb-5">
        <div className="px-5"><SectionHeading title={recent.length ? "Continue exploring" : "New arrivals"} to="/shop" action="Shop all" /></div>
        <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-2">
          {(recent.length ? recent : products.filter((p) => p.isNew)).slice(0, 6).map((p) =>
            <div key={p.id} className="w-[174px] shrink-0 snap-start"><ProductCard p={p} /></div>)}
        </div>
      </section>
      <p className="px-6 pb-7 pt-3 text-center text-[12px] leading-5 text-muted-foreground">
        Independent retail concept. Product availability and contract estimates require official MTC verification.
      </p>
    </Shell>
  );
}
