import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { nad, fromMonthly, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

export function ProductCard({ p }: { p: Product }) {
  const { mode, add } = useStore();
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-card p-3">
      <Link to="/product/$id" params={{ id: p.id }} className="block">
        <div className="aspect-square overflow-hidden rounded-2xl bg-surface-2"><img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover" /></div>
        {p.isNew && <span className="absolute left-5 top-5 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-foreground">NEW</span>}
        <p className="mt-3 truncate text-sm font-semibold">{p.name}</p>
        <p className="text-xs text-muted-foreground">{p.category}</p>
        <p className="mt-1 text-sm font-bold">{mode === "cash" ? nad(p.cash) : <><span className="text-xs font-normal text-muted-foreground">from </span>{nad(fromMonthly(p))}<span className="text-xs font-normal text-muted-foreground">/mo</span></>}</p>
      </Link>
      <button aria-label={`Add ${p.name}`} onClick={() => add({ id: p.id, name: p.name, image: p.image, variant: p.colors[0]!, price: p.cash, kind: "physical", mode: "cash" })}
        className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-mint text-mint-foreground"><Plus className="size-4" /></button>
    </div>
  );
}
