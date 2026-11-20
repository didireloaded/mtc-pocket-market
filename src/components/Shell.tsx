import { Link } from "@tanstack/react-router";
import { Home, Smartphone, Store, UserRound, Package } from "lucide-react";
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
    { to: "/mymtc" as const, label: "My MTC", icon: Smartphone },
    { to: "/orders" as const, label: "Orders", icon: Package },
    { to: "/settings" as const, label: "Account", icon: UserRound },
  ];
  if (editing) return null;
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-white px-2 pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 gap-0 pt-1">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }} aria-label={label}
            className="group flex h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-[10px] px-1 text-muted-foreground transition-colors data-[status=active]:text-primary">
            <Icon className="size-5" strokeWidth={1.9} />
            <span className="text-[12px] font-semibold leading-none">{label}</span>
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
    <ToggleGroupItem value="contract" className="h-10 rounded-full px-4 text-[13px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
      Contract estimate
    </ToggleGroupItem>
  </ToggleGroup>;
}
