import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, ShoppingBag, ArrowUpRight, ArrowRight, Smartphone, Laptop, Tablet, Watch, Router, Cable, SlidersHorizontal, Wifi, MapPin, Bookmark, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, SectionHeading, ProductStage } from "@/components/retail/RetailPrimitives";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, nad, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MTC Pocket Market — Devices, contracts and services" },
    { name: "description", content: "Discover devices, explore contracts, and manage your shopping journey in one place." },
    { property: "og:title", content: "MTC Pocket Market" },
    { property: "og:description", content: "A connected mobile retail concept for Namibia." },
    { property: "og:type", content: "website" },
  ] }),
  component: Home,
});

const categories = [
  { name: "Phones", Icon: Smartphone }, { name: "Laptops", Icon: Laptop },
  { name: "Tablets", Icon: Tablet }, { name: "Wearables", Icon: Watch },
  { name: "Data devices", Icon: Router }, { name: "Accessories", Icon: Cable },
] as const;

function Home() {
  const { user, extra, saved, cart, notices, setAuthOpen } = useStore();
  const featured = products.find((p) => p.featured) ?? products[0]!;
  const recent = extra.recent.map(getProduct).filter((p) => !!p).slice(0, 5);
  const favourites = saved.map(getProduct).filter((p) => !!p).slice(0, 5);
  const unread = notices.filter((n) => !n.read).length;
  const bagCount = cart.reduce((count, item) => count + item.qty, 0);
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.label?.split("@")[0]?.split(/[ ._-]/)[0];

  return <Shell>
    <header className="px-5 pt-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Eyebrow>POCKET MARKET <span className="font-medium text-muted-foreground">/ MTC concept</span></Eyebrow>
          <h1 className="mt-2 text-[29px] font-bold leading-[1.15] tracking-[-0.05em]">{user ? `${greeting}, ${firstName || "there"}.` : "Your next device starts here."}</h1>
          <p className="mt-2 text-[14px] leading-5 text-muted-foreground">{user ? "Pick up where you left off." : "Compare. Choose. Make the connection."}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="relative size-11 rounded-full" >
            <Link to="/notifications" aria-label="Notifications"><Bell className="size-5" />
              {unread > 0 && <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-brand-red text-[11px] font-bold text-white">{unread}</span>}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="icon" className="relative size-11 rounded-full bg-card shadow-none">
            <Link to="/cart" aria-label={`Shopping bag with ${bagCount} items`}><ShoppingBag className="size-5" />
              {bagCount > 0 && <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-primary text-[11px] font-bold text-white">{bagCount}</span>}
            </Link>
          </Button>
        </div>
      </div>
      <Button asChild variant="outline" className="mt-6 h-14 w-full justify-start gap-3 rounded-[18px] border-border/60 bg-card px-4 text-[14px] font-medium text-muted-foreground shadow-none">
        <Link to="/shop"><Search className="size-5 text-mint" /><span className="flex-1 text-left">Find phones, laptops or data devices</span><ArrowUpRight className="size-4" /></Link>
      </Button>
    </header>

    <section className="retail-section px-5">
      <Card className="relative overflow-hidden rounded-[26px] border-0 bg-[#deebf7] shadow-none">
        <div className="relative z-10 flex min-h-[230px] w-[64%] flex-col justify-between p-5">
          <div>
            <Badge variant="outline" className="rounded-full border-[#aacbe4] bg-white/70 text-[12px] font-semibold text-[#245a82]">Featured device</Badge>
            <h2 className="mt-4 max-w-[210px] text-[25px] font-bold leading-[1.12] tracking-[-0.05em] text-[#172f43]">{featured.name}</h2>
            <p className="mt-3 text-[13px] font-semibold text-[#315976]">Outright {nad(featured.cash)}</p>
          </div>
          <Button asChild className="h-11 w-fit rounded-full bg-[#172f43] px-4 text-[13px] font-semibold shadow-none hover:bg-[#315976]">
            <Link to="/product/$id" params={{ id: featured.id }}>Explore device <ArrowUpRight className="size-4" /></Link>
          </Button>
        </div>
        <img src={featured.image} alt={featured.name} loading="eager" decoding="async" className="pointer-events-none absolute -right-5 bottom-0 h-[90%] w-[48%] object-contain" />
      </Card>
    </section>

    <section className="retail-section px-5">
      <SectionHeading title="Find what fits." description="Choose a device and a monthly budget." />
      <Link to="/find" className="mt-4 flex items-center gap-4 rounded-[22px] bg-primary p-5 text-primary-foreground focus-visible:outline-offset-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-white/15"><SlidersHorizontal className="size-6" /></div>
        <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold uppercase tracking-wide text-white/65">Contract finder</p>
          <p className="mt-1 text-[18px] font-bold leading-6">Start with your budget</p>
          <p className="mt-1 text-[13px] leading-5 text-white/70">Explore plans and estimated monthly costs.</p></div>
        <ArrowUpRight className="size-5 shrink-0" />
      </Link>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-auto min-h-16 justify-start gap-2 rounded-[19px] border-border/70 bg-card px-3 text-[13px] shadow-none">
          <Link to="/compare"><Smartphone className="size-[18px] text-mint" />Compare devices <ArrowRight className="ml-auto size-4 text-muted-foreground" /></Link>
        </Button>
        <Button asChild variant="outline" className="h-auto min-h-16 justify-start gap-2 rounded-[19px] border-border/70 bg-card px-3 text-[13px] shadow-none">
          <Link to="/orders"><ShoppingBag className="size-[18px] text-mint" />Your orders <ArrowRight className="ml-auto size-4 text-muted-foreground" /></Link>
        </Button>
      </div>
    </section>

    {user ? <section className="retail-section px-5">
      <Card className="rounded-[22px] border-border/70 bg-card p-4 shadow-none">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 size-5 shrink-0 text-mint" />
          <div className="min-w-0 flex-1"><p className="text-[15px] font-semibold">Your Pocket Market account</p>
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">You're signed in. Actual MTC balances and services need a verified account connection.</p></div>
          <Badge variant="secondary" className="shrink-0 rounded-full text-[11px]">Not linked</Badge>
        </div>
        <Button asChild variant="secondary" className="mt-3 h-11 w-full rounded-full shadow-none"><Link to="/mymtc">Explore My MTC <ArrowRight className="size-4" /></Link></Button>
      </Card>
    </section> : <section className="retail-section px-5">
      <button type="button" onClick={() => setAuthOpen(true)} className="flex w-full min-h-[72px] items-center gap-4 rounded-[20px] border border-border/70 bg-card p-4 text-left">
        <div className="min-w-0 flex-1"><p className="text-[15px] font-semibold">Already have an account?</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Sign in to save your shopping journey.</p></div>
        <ArrowRight className="size-5 shrink-0 text-mint" />
      </button>
    </section>}

    <section className="retail-section">
      <div className="px-5"><SectionHeading title="Browse categories" to="/shop" action="Shop all" /></div>
      <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
        {categories.map(({ name, Icon }) => {
          const image = products.find((p) => p.category === name)?.image;
          return <Link key={name} to="/shop" search={{ c: name }} className="flex w-[82px] shrink-0 flex-col items-center gap-2">
            <div className="grid size-[76px] place-items-center rounded-[20px] border border-border/60 bg-card p-2">
              {image ? <img src={image} alt="" loading="lazy" decoding="async" className="size-full object-contain" /> : <Icon className="size-6 text-mint" />}
            </div>
            <span className="text-center text-[13px] font-medium leading-[1.3]">{name}</span>
          </Link>;
        })}
      </div>
    </section>

    <section className="retail-section px-5">
      <div className="grid grid-cols-2 gap-3">
        <Link to="/shop" search={{ c: "Data devices" }} className="flex min-h-32 flex-col rounded-[20px] bg-card p-4">
          <Wifi className="size-6 text-mint" /><p className="mt-auto text-[15px] font-semibold">Stay connected</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Routers and data devices</p>
        </Link>
        <Link to="/stores" className="flex min-h-32 flex-col rounded-[20px] bg-card p-4">
          <MapPin className="size-6 text-mint" /><p className="mt-auto text-[15px] font-semibold">MTC locations</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Explore collection branches</p>
        </Link>
      </div>
    </section>

    {favourites.length > 0 && <section className="retail-section">
      <div className="px-5"><SectionHeading title="Saved for later" description="The devices you've bookmarked." /></div>
      <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
        {favourites.map((p) => <div key={p.id} className="w-[190px] shrink-0 snap-start"><ProductCard p={p} /></div>)}
      </div>
    </section>}

    <section className="retail-section pb-5">
      <div className="px-5"><SectionHeading title={recent.length ? "Continue exploring" : "Just arrived"} to="/shop" action="See all" /></div>
      <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
        {(recent.length ? recent : products.filter((p) => p.isNew)).slice(0, 6).map((p) =>
          <div key={p.id} className="w-[190px] shrink-0 snap-start"><ProductCard p={p} /></div>)}
      </div>
    </section>
    <p className="px-6 pb-7 pt-3 text-center text-[12px] leading-5 text-muted-foreground">Independent retail concept. Stock, contract estimates and services need official MTC verification.</p>
  </Shell>;
}
