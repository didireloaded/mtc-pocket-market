import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Home, ShoppingBag, Store, UserRound, Package } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Shell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md bg-background">
      <main id="pocket-main" className={cn(nav && "pb-[calc(104px+env(safe-area-inset-bottom))]")}>{children}</main>
      {nav && <BottomNav />}
    </div>
  );
}

/** Five destinations cover the complete customer journey. The bag stays accessible from Home and Shop. */
function BottomNav() {
  const reduceMotion = useReducedMotion();
  const { cart, cartPulse } = useStore();
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const update = () => setEditing(Boolean(document.activeElement?.matches("input, textarea, select, [contenteditable='true']")));
    const afterFocus = () => window.requestAnimationFrame(update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", afterFocus);
    update();
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", afterFocus);
    };
  }, []);
  const items = [
    { to: "/" as const, label: "Home", icon: Home },
    { to: "/shop" as const, label: "Shop", icon: Store },
    { to: "/cart" as const, label: "Cart", icon: ShoppingBag },
    { to: "/orders" as const, label: "Orders", icon: Package },
    { to: "/settings" as const, label: "Profile", icon: UserRound },
  ];
  if (editing) return null;
  return (
    <nav aria-label="Main navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-5 pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto grid grid-cols-5 gap-1 rounded-full border border-[#E5E7E5] bg-white p-2 shadow-[0_5px_24px_rgba(32,46,57,0.10)]">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} aria-label={to === "/cart" ? `Cart, ${cartCount} items` : label}
            className="group flex h-12 min-w-0 items-center justify-center rounded-full text-[#202E39] transition-[background-color,transform] duration-150 ease-out hover:bg-[#F2F3F0] active:scale-[0.96] motion-reduce:transform-none data-[status=active]:bg-[#202E39] data-[status=active]:text-white">
            <motion.span key={to === "/cart" ? `cart-${cartPulse}` : to}
              initial={to === "/cart" && cartPulse > 0 && !reduceMotion ? { scale: 0.78, rotate: -8 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 620, damping: 19 }}
              className="relative grid size-8 place-items-center">
              <Icon aria-hidden="true" className="size-[21px]" strokeWidth={1.9} />
              {to === "/cart" && cartCount > 0 && <motion.span key={cartCount}
                initial={reduceMotion ? false : { scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18, ease: "easeOut" }}
                aria-label={`${cartCount} items`}
                className="absolute -right-2 -top-1 grid min-h-[17px] min-w-[17px] place-items-center rounded-full bg-[#DD2A1B] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount > 99 ? "99+" : cartCount}
              </motion.span>}
            </motion.span>
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PriceToggle() {
  const { mode, setMode } = useStore();
  return <ToggleGroup type="single" value={mode} onValueChange={(value) => {
    if (value === "cash" || value === "contract") setMode(value);
  }} aria-label="Price display mode"
    className="inline-grid grid-cols-2 gap-1 rounded-[13px] border border-border bg-white p-1">
    <ToggleGroupItem value="cash" className="h-10 rounded-[10px] px-4 text-[13px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
      Buy outright
    </ToggleGroupItem>
    <ToggleGroupItem value="contract" className="h-10 rounded-[10px] px-4 text-[13px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
      Contract estimate
    </ToggleGroupItem>
  </ToggleGroup>;
}
