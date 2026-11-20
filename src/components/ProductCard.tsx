import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductStage } from "@/components/retail/RetailPrimitives";
import { nad, fromMonthly, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Editorial retail tile: product first, one main action, no stacked card chrome. */
export function ProductCard({ p }: { p: Product }) {
  const { mode, add, saved, toggleSave } = useStore();
  const navigate = useNavigate();
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
    void navigate({ to: "/cart" });
  };

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
          <Button type="button" onClick={addOutright}
            aria-label={`Add ${p.name} to bag at cash price`}
            className="mt-3 h-11 w-full rounded-[12px] px-2 text-[13px] font-semibold">
            <ShoppingBag strokeWidth={2} className="size-4" /> Add to bag
          </Button>
        )}
      </div>
    </article>
  );
}
