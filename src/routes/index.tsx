import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, QrCode, Search, ShoppingBag } from "lucide-react";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { products, getProduct } from "@/lib/data";
import { FeaturedDeviceHero } from "@/components/FeaturedDeviceHero";
import { MtcLogo } from "@/components/MtcLogo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MTC Pocket Market — Discover devices" },
    { name: "description", content: "Browse MTC devices, explore categories and discover new arrivals. Guest shopping is available." },
    { property: "og:title", content: "MTC Pocket Market" },
    { property: "og:description", content: "Explore phones, laptops, devices and more in Pocket Market." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Home,
});

const categories = ["Phones", "Laptops", "Wearables", "Tablets"] as const;

function Home() {
  const { extra } = useStore();
  const featured = products.find((product) => product.featured) ?? products[0]!;
  const newArrivals = products.filter((product) => product.isNew);
  const recentlyViewed = extra.recent.map(getProduct).filter((product) => !!product);
  // Personalise the one carousel, never add a second section to Home.
  const showcase = (recentlyViewed.length ? recentlyViewed : newArrivals.length ? newArrivals : products).slice(0, 6);
  const carouselTitle = recentlyViewed.length ? "Continue exploring" : "New arrivals";

  return (
    <Shell>
      <header className="flex items-center justify-between bg-white px-6 pb-4 pt-[max(20px,env(safe-area-inset-top))]">
        <Link to="/" aria-label="Pocket Market home"
          className="inline-flex min-h-14 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2">
          <MtcLogo className="size-[55px]" />
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/shop" aria-label="Search devices"
            className="grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2">
            <Search aria-hidden="true" className="size-[21px]" strokeWidth={1.9} />
          </Link>
          <ShoppingBagLink />
        </div>
      </header>

      <div className="space-y-9 px-6 pb-8 pt-6">
        <FeaturedDeviceHero product={featured} />

        <section aria-labelledby="quick-categories-heading">
          <h2 id="quick-categories-heading" className="text-[20px] font-bold tracking-[-0.04em]">Shop by category</h2>
          <div className="mt-5 grid grid-cols-5 gap-1.5">
            {categories.map((name) => {
              const product = products.find((item) => item.category === name);
              return (
                <Link key={name} to="/shop" search={{ c: name }}
                  className="group flex min-w-0 flex-col items-center gap-2 text-center">
                  <span className="grid size-[49px] place-items-center overflow-hidden rounded-full bg-stage p-2.5 transition-colors group-hover:bg-[#E5E9EC] min-[390px]:size-[60px]">
                    {product && <img src={product.image} alt="" loading="lazy" decoding="async"
                      className="size-full object-contain" />}
                  </span>
                  <span className="text-[11px] font-medium leading-4 text-foreground min-[390px]:text-[12px]">{name}</span>
                </Link>
              );
            })}
            <Link to="/esim" className="group flex min-w-0 flex-col items-center gap-2 text-center">
              <span className="grid size-[49px] place-items-center rounded-full bg-stage transition-colors group-hover:bg-[#E5E9EC] min-[390px]:size-[60px]">
                <QrCode aria-hidden="true" className="size-6 text-foreground" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-medium leading-4 text-foreground min-[390px]:text-[12px]">eSIM</span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="arrivals-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="arrivals-heading" className="text-[20px] font-bold tracking-[-0.04em]">
              {carouselTitle}
            </h2>
            <Link to="/shop" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[13px] font-semibold text-mint">
              Shop all <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="no-scrollbar -mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
            {showcase.map((product) => (
              <div key={product.id} className="w-[152px] shrink-0 snap-start min-[390px]:w-[170px]">
                <ProductCard p={product} minimal />
              </div>
            ))}
          </div>
        </section>
      </div>
      <p className="px-6 pb-8 text-center text-[12px] leading-5 text-muted-foreground">
        Independent retail concept. Availability and contract prices require MTC confirmation.
      </p>
    </Shell>
  );
}

function ShoppingBagLink() {
  const { cart } = useStore();
  const count = cart.reduce((total, item) => total + item.qty, 0);
  return (
    <Link to="/cart" aria-label={`Shopping bag with ${count} items`}
      className="relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2">
      <ShoppingBag aria-hidden="true" className="size-[21px]" strokeWidth={1.9} />
      {count > 0 && <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
        {count}
      </span>}
    </Link>
  );
}
