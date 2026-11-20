import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Store, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <div className={cn(nav && "pb-28")}>{children}</div>
      {nav && <BottomNav />}
    </div>
  );
}
function BottomNav() {
  const { cart } = useStore();
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/mymtc", label: "MyMTC", icon: UserRound },
    { to: "/cart", label: "Cart", icon: ShoppingBag },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-4">
      <div className="flex items-center justify-between gap-1 rounded-full border bg-card p-1.5 shadow-card">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} aria-label={label}
            className="group relative flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-all data-[status=active]:flex-1 data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
            <span className="relative"><Icon className="size-5" />
              {label === "Cart" && count > 0 && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-brand-red text-[9px] font-bold text-primary-foreground">{count}</span>}
            </span>
            <span className="hidden group-data-[status=active]:inline">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
export function PriceToggle() {
  const { mode, setMode } = useStore();
  return (
    <div className="inline-flex rounded-full border bg-card p-1 text-xs font-semibold">
      {(["cash", "contract"] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)} className={cn("rounded-full px-4 py-1.5 capitalize transition", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{m}</button>
      ))}
    </div>
  );
}
