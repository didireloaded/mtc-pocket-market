import { Link } from "@tanstack/react-router";
import { pressClass } from "@/lib/retail-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { nad, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

/** Reference-led editorial device presentation. Only verified product information. */
export function FeaturedDeviceHero({ product }: { product: Product }) {
  const { add } = useStore();
  const addFeatured = () => add({
    id: product.id,
    name: product.name,
    image: product.image,
    variant: product.colors[0] ?? "Standard",
    price: product.cash,
    kind: "physical",
    mode: "cash",
  });

  return (
    <section aria-label="Featured iPhone">
      <div className="relative isolate h-[590px] overflow-hidden rounded-[28px] bg-[radial-gradient(ellipse_at_50%_52%,#395A6C_0%,#253D4A_38%,#142630_72%,#101B24_100%)] text-white">
        <h1 className="pocket-reveal absolute inset-x-5 top-12 z-10 mx-auto max-w-[330px] text-center text-[34px] font-bold leading-[1.04] tracking-[-0.055em] min-[390px]:text-[39px]">
          Make space for something better.
        </h1>

        <div style={{ animationDelay: "70ms" }} className="pocket-reveal absolute inset-x-5 bottom-[116px] h-[244px] rounded-[30px] bg-white text-[#202E39] shadow-[0_15px_32px_rgba(0,0,0,0.11)]">
          <img src={product.image} alt={product.name} loading="eager" decoding="async"
            className="pointer-events-none absolute inset-x-0 -top-[86px] mx-auto h-[220px] w-[90%] object-contain drop-shadow-[0_20px_15px_rgba(8,20,30,0.16)]" />
          <div className="absolute inset-x-4 bottom-[35px] text-center">
            <h2 className="line-clamp-2 text-[16px] font-semibold leading-[22px] tracking-[-0.03em]">{product.name}</h2>
            <p className="mt-2 text-[23px] font-bold leading-7 tracking-[-0.045em] tabular-nums">{nad(product.cash)}</p>
          </div>
          <Link to="/cart" onClick={addFeatured}
            aria-label={`Add ${product.name} to cart and open cart`}
            className={`absolute -bottom-[23px] left-1/2 z-20 grid size-[52px] -translate-x-1/2 place-items-center rounded-full bg-[#202E39] text-white shadow-[0_7px_20px_rgba(0,0,0,0.19)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${pressClass}`}>
            <ShoppingBag aria-hidden="true" className="size-[22px]" strokeWidth={1.9} />
          </Link>
        </div>

        <Link to="/product/$id" params={{ id: product.id }}
          className={`absolute inset-x-5 bottom-6 flex h-[54px] items-center justify-center gap-2 rounded-full bg-white text-[14px] font-semibold text-[#202E39] hover:bg-[#F1F2F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${pressClass}`}>
          Explore the iPhone <ArrowRight aria-hidden="true" className="size-[18px]" />
        </Link>
      </div>
    </section>
  );
}
