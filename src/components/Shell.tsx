import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Store, UserRound, Package } from "lucide-react";
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

/** Five destinations cover the complete customer journey. The bag stays accessible from Home and Shop. */
function BottomNav() {
  const items = [
    { to: "/" as const, label: "Home", icon: Home },
    { to: "/shop" as const, label: "Shop", icon: Store },
    { to: "/mymtc" as const, label: "My MTC", icon: ShoppingBag },
    { to: "/orders" as const, label: "Orders", icon: Package },
    { to: "/settings" as const, label: "Account", icon: UserRound },
  ];
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-1 rounded-[24px] border bg-card/95 p-1.5 shadow-card backdrop-blur">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} aria-label={label}
            className="group flex h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[18px] px-1 text-muted-foreground transition-colors data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
            <Icon className="size-[19px]" strokeWidth={1.9} />
            <span className="text-[10px] font-semibold leading-none">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PriceToggle() {
  const { mode, setMode } = useStore();
  return (
    <div className="inline-flex rounded-full border bg-card p-1 text-xs font-semibold" aria-label="Price display mode">
      {(["cash", "contract"] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
          className={cn("rounded-full px-4 py-2 capitalize transition-colors", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
          {m === "cash" ? "Buy outright" : "Contract estimate"}
        </button>
      ))}
    </div>
  );
}
