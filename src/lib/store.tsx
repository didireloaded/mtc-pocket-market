import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type CartItem = { key: string; id: string; name: string; image?: string; variant: string; price: number; qty: number; kind: "physical" | "digital"; mode?: "cash" | "contract" };
export type User = { label: string; method: "phone" | "email" };
export type Order = { id: string; placedAt: number; items: { name: string; qty: number; kind: "physical" | "digital" }[]; total: number; address: string };
type Store = {
  cart: CartItem[]; add: (i: Omit<CartItem, "qty" | "key">) => void; setQty: (k: string, q: number) => void; remove: (k: string) => void; clear: () => void;
  mode: "cash" | "contract"; setMode: (m: "cash" | "contract") => void;
  user: User | null; guest: boolean; login: (u: User) => void; orders: Order[]; placeOrder: (o: Omit<Order, "id" | "placedAt">) => string; browseGuest: () => void; logout: () => void; authOpen: boolean; setAuthOpen: (b: boolean) => void;
  saved: string[]; toggleSave: (id: string) => void; kycDone: boolean; setKycDone: (b: boolean) => void;
};
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<"cash" | "contract">("cash");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [guest, setGuest] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [kycDone, setKycDone] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("mtc") || "{}");
      if (s.cart) setCart(s.cart); if (s.user?.label) setUser(s.user); if (s.orders) setOrders(s.orders); if (s.guest) setGuest(true); if (s.saved) setSaved(s.saved); if (s.kycDone) setKycDone(true);
      if (!s.user && !s.guest) setAuthOpen(true);
    } catch { setAuthOpen(true); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("mtc", JSON.stringify({ cart, user, guest, saved, kycDone, orders })); }, [cart, user, guest, saved, kycDone, orders, ready]);
  const add: Store["add"] = (i) => setCart((c) => {
    const key = `${i.id}-${i.variant}-${i.mode ?? ""}`;
    const ex = c.find((x) => x.key === key);
    return ex ? c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...i, key, qty: 1 }];
  });
  return <Ctx.Provider value={{ cart, add, setQty: (k, q) => setCart((c) => q < 1 ? c.filter((x) => x.key !== k) : c.map((x) => (x.key === k ? { ...x, qty: q } : x))),
    remove: (k) => setCart((c) => c.filter((x) => x.key !== k)), clear: () => setCart([]), mode, setMode, user, guest,
    orders, placeOrder: (o) => { const id = "MTC" + Date.now().toString().slice(-7); setOrders((x) => [{ ...o, id, placedAt: Date.now() }, ...x]); return id; },
    login: (u) => { setUser(u); setGuest(false); setAuthOpen(false); }, browseGuest: () => { setGuest(true); setAuthOpen(false); },
    logout: () => { setUser(null); setGuest(false); setAuthOpen(true); }, authOpen, setAuthOpen, saved,
    toggleSave: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), kycDone, setKycDone }}>{children}</Ctx.Provider>;
}
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error("no store"); return c; };
