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
      <div className="flex items-center justify-around rounded-[28px] border bg-card/90 p-2 backdrop-blur-xl">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="group relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium text-muted-foreground data-[status=active]:text-mint">
            <span className="relative"><Icon className="size-5" />
              {label === "Cart" && count > 0 && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{count}</span>}
            </span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
export function PriceToggle() {
  const { mode, setMode } = useStore();
  return (
    <div className="inline-flex rounded-full bg-card p-1 text-xs font-semibold">
      {(["cash", "contract"] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)} className={cn("rounded-full px-4 py-1.5 capitalize transition", mode === m ? "bg-mint text-mint-foreground" : "text-muted-foreground")}>{m}</button>
      ))}
    </div>
  );
}
