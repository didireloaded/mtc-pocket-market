import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductStage } from "@/components/retail/RetailPrimitives";
import { nad, fromMonthly, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** One consistent product tile for Home, Shop and recommendation surfaces. */
export function ProductCard({ p }: { p: Product }) {
  const { mode, add, saved, toggleSave } = useStore();
  const navigate = useNavigate();
  const isSaved = saved.includes(p.id);
  const estimate = mode === "contract" && p.contractable;

  const addOutright = () => {
    add({
    id: p.id, name: p.name, image: p.image, variant: p.colors[0] ?? "Standard",
    price: p.cash, kind: "physical", mode: "cash",
    });
    void navigate({ to: "/cart" });
  };
  return (
    <Card className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] border-border/60 bg-card p-2.5 shadow-none transition-colors hover:border-mint/30">
      <Link to="/product/$id" params={{ id: p.id }} className="block rounded-[18px] outline-offset-2">
        <ProductStage src={p.image} alt={p.name} className="rounded-[16px] p-3 transition-transform duration-300 group-hover:scale-[1.02]" />
      </Link>
      {p.badge && <Badge variant="secondary" className="absolute left-4 top-4 max-w-[65%] truncate rounded-full border-0 bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-foreground">{p.badge}</Badge>}
      <Button type="button" variant="secondary" size="icon" aria-label={isSaved ? `Remove ${p.name} from saved devices` : `Save ${p.name}`}
        aria-pressed={isSaved} onClick={() => toggleSave(p.id)}
        className="absolute right-4 top-4 size-10 rounded-full border border-border/70 bg-card/95 shadow-none">
        <Heart className={cn("size-4", isSaved && "fill-brand-red text-brand-red")} />
      </Button>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{p.brand} · {p.category}</p>
        <Link to="/product/$id" params={{ id: p.id }} className="mt-1 block text-[15px] font-semibold leading-5 tracking-tight line-clamp-2 min-h-10">{p.name}</Link>
        <div className="mt-auto pt-3">
          <p className="text-xs text-muted-foreground">{estimate ? "Estimated from" : "Buy outright"}</p>
          <p className="mt-0.5 text-[19px] font-bold leading-6 tracking-tight tabular-nums">{nad(estimate ? fromMonthly(p) : p.cash)}
            {estimate && <span className="ml-1 text-xs font-medium text-muted-foreground">/mo</span>}
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-1 border-t border-border/70 pt-2.5">
          {estimate ? <Button asChild className="h-11 w-full rounded-full px-2 text-xs font-semibold shadow-none">
            <Link to="/product/$id" params={{ id: p.id }}>Choose plan <ArrowUpRight className="size-4" /></Link>
          </Button> : <Button type="button" onClick={addOutright}
            aria-label={`Add ${p.name} to bag at cash price`} className="h-11 w-full rounded-full px-2 text-xs font-semibold shadow-none">
            <ShoppingBag className="size-4 shrink-0" /> Add to bag
          </Button>}
          <Button asChild variant="ghost" className="h-9 w-full rounded-full px-2 text-xs text-muted-foreground">
            <Link to="/product/$id" params={{ id: p.id }}>View details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
