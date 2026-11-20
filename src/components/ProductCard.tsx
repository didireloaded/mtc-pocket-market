import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductStage } from "@/components/retail/RetailPrimitives";
import { nad, fromMonthly, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Editorial retail tile: product first, one main action, no stacked card chrome. */
export function ProductCard({ p, minimal = false, catalog = false }: { p: Product; minimal?: boolean; catalog?: boolean }) {
  const { mode, add, saved, toggleSave } = useStore();
  const isSaved = saved.includes(p.id);
  const estimate = mode === "contract" && p.contractable;

  const addOutright = () => {
    add({
      id: p.id,
      name: p.name,
      image: p.image,
      variant: p.colors[0] ?? "Standard",
      price: p.cash,
      kind: "physical",
      mode: "cash",
    });
  };

  if (catalog) {
    return (
      <article className="group relative flex h-full min-w-0 flex-col pb-[22px] pt-10">
        <div className="relative flex min-h-[224px] flex-1 flex-col items-center rounded-[28px] bg-white px-3 pb-10 pt-[114px] text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <Link to="/product/$id" params={{ id: p.id }} aria-label={`View ${p.name}`}
            className="absolute inset-x-2 -top-10 z-10 flex h-[150px] items-center justify-center rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
            <img src={p.image} alt={p.name} loading="lazy" decoding="async"
              className="h-full max-h-full w-[94%] object-contain drop-shadow-[0_10px_12px_rgba(32,46,57,0.12)] transition-transform duration-200 group-hover:scale-[1.035] motion-reduce:transform-none" />
          </Link>
          {p.badge && <span className="absolute right-2 top-2 z-20 max-w-[calc(100%-16px)] truncate rounded-full bg-[#202E39] px-2 py-1 text-[10px] font-semibold text-white">
            {p.badge}
          </span>}
          <Link to="/product/$id" params={{ id: p.id }}
            className="mt-auto line-clamp-2 min-h-[42px] max-w-full text-[14px] font-semibold leading-[21px] tracking-[-0.025em] text-foreground">
            {p.name}
          </Link>
          <p className="mt-1 text-[18px] font-bold tracking-[-0.035em] tabular-nums text-foreground">
            {estimate ? nad(fromMonthly(p)) : nad(p.cash)}
            {estimate && <span className="ml-1 text-[11px] font-medium tracking-normal text-muted-foreground">/mo est.</span>}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-3">
          <button type="button" aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${p.name} from saved products` : `Save ${p.name}`}
            onClick={() => toggleSave(p.id)}
            className={cn("grid size-11 place-items-center rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint",
              isSaved ? "bg-primary text-white" : "bg-white text-[#202E39]")}>
            <Heart aria-hidden="true" strokeWidth={1.9} className={cn("size-[19px]", isSaved && "fill-current")} />
          </button>
          {estimate ? (
            <Link to="/product/$id" params={{ id: p.id }}
              aria-label={`Choose a contract for ${p.name}`}
              className="grid size-11 place-items-center rounded-full bg-primary text-white shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
              <ArrowUpRight aria-hidden="true" strokeWidth={1.9} className="size-[19px]" />
            </Link>
          ) : (
            <Link to="/cart" onClick={addOutright}
              aria-label={`Add ${p.name} to cart and open cart`}
              className="grid size-11 place-items-center rounded-full bg-primary text-white shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
              <ShoppingBag aria-hidden="true" strokeWidth={1.9} className="size-[19px]" />
            </Link>
          )}
        </div>
      </article>
    );
  }

  if (minimal) {
    return (
      <article className="min-w-0">
        <Link to="/product/$id" params={{ id: p.id }} aria-label={`View ${p.name}, outright price ${nad(p.cash)}`}
          className="group block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
          <ProductStage src={p.image} alt={p.name}
            className="rounded-[14px] bg-stage p-4 transition-colors group-hover:bg-[#E6EAED]" />
          <h3 className="mt-3 line-clamp-2 min-h-[42px] text-[14px] font-semibold leading-[21px] tracking-[-0.02em] text-foreground">
            {p.name}
          </h3>
          <p className="mt-2 text-[19px] font-bold tracking-[-0.035em] tabular-nums text-foreground">
            {nad(p.cash)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <div className="relative">
        <Link to="/product/$id" params={{ id: p.id }} aria-label={`Explore ${p.name}`}
          className="block rounded-[15px] focus-visible:outline-offset-2">
          <ProductStage src={p.image} alt={p.name}
            className="rounded-[15px] border border-border/70 bg-stage p-4 transition-colors duration-150 group-hover:border-[#bfc7cc]" />
        </Link>
        {p.badge && <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-64px)] truncate rounded-[6px] bg-white/95 px-2 py-1 text-[11px] font-semibold text-foreground">
          {p.badge}
        </span>}
        <button type="button" aria-label={isSaved ? `Remove ${p.name} from saved devices` : `Save ${p.name}`}
          aria-pressed={isSaved} onClick={() => toggleSave(p.id)}
          className="absolute right-2 top-2 grid size-11 place-items-center rounded-full border border-border/70 bg-white/95 text-foreground transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint">
          <Heart aria-hidden="true" strokeWidth={1.9} className={cn("size-[19px]", isSaved && "fill-brand-red text-brand-red")} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">{p.brand}</p>
        <Link to="/product/$id" params={{ id: p.id }}
          className="mt-1 line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-[22px] tracking-[-0.02em] text-foreground hover:text-mint">
          {p.name}
        </Link>
        <div className="mt-auto pt-3">
          <p className="text-[12px] leading-5 text-muted-foreground">{estimate ? "Estimated monthly" : "Outright price"}</p>
          <p className="text-[22px] font-bold leading-[28px] tracking-[-0.045em] tabular-nums text-foreground">
            {nad(estimate ? fromMonthly(p) : p.cash)}
            {estimate && <span className="ml-1 text-[12px] font-medium tracking-normal text-muted-foreground">/mo</span>}
          </p>
        </div>
        {estimate ? (
          <Button asChild className="mt-3 h-11 w-full rounded-[12px] px-2 text-[13px] font-semibold">
            <Link to="/product/$id" params={{ id: p.id }}>Explore plans <ArrowUpRight strokeWidth={2} className="size-4" /></Link>
          </Button>
        ) : (
          <Button asChild className="mt-3 h-11 w-full rounded-[12px] px-2 text-[13px] font-semibold">
            <Link to="/cart" onClick={addOutright} aria-label={`Add ${p.name} to cart and open cart`}>
              <ShoppingBag strokeWidth={2} className="size-4" /> Add to cart
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
