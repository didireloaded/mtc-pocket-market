import type * as React from "react";
import { toast } from "sonner";
import { timeline } from "./timeline";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type CartItem = { key: string; id: string; name: string; image?: string; variant: string; price: number; qty: number; kind: "physical" | "digital"; mode?: "cash" | "contract" };
export type User = { label: string; method: "phone" | "email" };
export type Order = { id: string; placedAt: number; items: { name: string; qty: number; kind: "physical" | "digital" }[]; total: number; address: string; tracking: string; shippedTotal: number; digitalTotal: number; esimEmail: string };
export type Notice = { key: string; orderId: string; title: string; body: string; at: number; read: boolean };
export type SavedAddress = { label: string; name: string; street: string; town: string; phone: string };
export type Extra = {
  onboarded: boolean; recent: string[]; searches: string[]; addresses: SavedAddress[];
  kyc: "none" | "pending" | "approved" | "rejected"; prefs: { orders: boolean; priceDrops: boolean; lowBalance: boolean };
  numbers: { number: string; label: string }[]; biometric: boolean;
};
const defaultExtra: Extra = { onboarded: false, recent: [], searches: [], addresses: [{ label: "Home", name: "", street: "12 Independence Ave", town: "Windhoek", phone: "" }],
  kyc: "none", prefs: { orders: true, priceDrops: true, lowBalance: true }, numbers: [], biometric: false };
type Store = {
  cart: CartItem[]; add: (i: Omit<CartItem, "qty" | "key">) => void; setQty: (k: string, q: number) => void; remove: (k: string) => void; clear: () => void;
  mode: "cash" | "contract"; setMode: (m: "cash" | "contract") => void;
  user: User | null; guest: boolean; login: (u: User) => void; orders: Order[]; placeOrder: (o: Omit<Order, "id" | "placedAt" | "tracking">) => string; notices: Notice[]; markAllRead: () => void; browseGuest: () => void; logout: () => void; authOpen: boolean; setAuthOpen: (b: boolean) => void;
  extra: Extra; setExtra: (f: (e: Extra) => Extra) => void; viewProduct: (id: string) => void;
  saved: string[]; toggleSave: (id: string) => void; kycDone: boolean; setKycDone: (b: boolean) => void;
};
// Keep one context across hot reloads so a reloaded hook never loses its provider.
const g = globalThis as { __mtcStoreCtx?: React.Context<Store | null> };
const Ctx = (g.__mtcStoreCtx ??= createContext<Store | null>(null));
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<"cash" | "contract">("cash");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [extra, setExtraState] = useState<Extra>(defaultExtra);
  const [guest, setGuest] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [kycDone, setKycDone] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("mtc") || "{}");
      if (s.cart) setCart(s.cart); if (s.user?.label) setUser(s.user); if (s.orders) setOrders(s.orders.filter((o: Order) => o.tracking)); if (s.notices) setNotices(s.notices); if (s.extra) setExtraState({ ...defaultExtra, ...s.extra }); if (s.guest) setGuest(true); if (s.saved) setSaved(s.saved); if (s.kycDone) setKycDone(true);
      if (!s.user && !s.guest && s.extra?.onboarded) setAuthOpen(true);
    } catch { /* first visit: welcome screens show first */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("mtc", JSON.stringify({ cart, user, guest, saved, kycDone, orders, notices, extra })); }, [cart, user, guest, saved, kycDone, orders, notices, extra, ready]);
  // Watch the order timeline and raise a notice the first time an order reaches Shipped / Out for delivery.
  useEffect(() => {
    if (!ready) return;
    const tick = () => {
      const now = Date.now();
      setNotices((prev) => {
        const fresh: Notice[] = [];
        for (const o of orders) for (const e of timeline(o, now)) {
          if (!e.reached || e.stage === "Processing") continue;
          const key = `${o.id}:${e.stage}`;
          if (prev.some((n) => n.key === key)) continue;
          const n = { key, orderId: o.id, title: e.stage === "Shipped" ? `Order ${o.id} has shipped` : `Order ${o.id} is out for delivery`, body: e.note, at: e.at, read: false };
          fresh.push(n); toast(n.title, { description: n.body });
        }
        return fresh.length ? [...fresh, ...prev] : prev;
      });
    };
    tick(); const t = setInterval(tick, 10000); return () => clearInterval(t);
  }, [orders, ready]);
  // Demo VERIFI review: a submitted application is approved a few seconds later.
  useEffect(() => {
    if (extra.kyc !== "pending") return;
    const t = setTimeout(() => { setExtraState((e) => ({ ...e, kyc: "approved" })); setKycDone(true); toast.success("VERIFI approved", { description: "You're cleared for contract plans." }); }, 6000);
    return () => clearTimeout(t);
  }, [extra.kyc]);
  const add: Store["add"] = (i) => setCart((c) => {
    const key = `${i.id}-${i.variant}-${i.mode ?? ""}`;
    const ex = c.find((x) => x.key === key);
    return ex ? c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...i, key, qty: 1 }];
  });
  return <Ctx.Provider value={{ cart, add, setQty: (k, q) => setCart((c) => q < 1 ? c.filter((x) => x.key !== k) : c.map((x) => (x.key === k ? { ...x, qty: q } : x))),
    remove: (k) => setCart((c) => c.filter((x) => x.key !== k)), clear: () => setCart([]), mode, setMode, user, guest,
    orders, placeOrder: (o) => { const id = "MTC" + Date.now().toString().slice(-7); setOrders((x) => [{ ...o, id, tracking: "NP" + id.slice(3) + "NA", placedAt: Date.now() }, ...x]); return id; },
    extra, setExtra: setExtraState, viewProduct: (id) => setExtraState((e) => ({ ...e, recent: [id, ...e.recent.filter((x) => x !== id)].slice(0, 8) })),
    notices, markAllRead: () => setNotices((n) => n.map((x) => ({ ...x, read: true }))),
    login: (u) => { setUser(u); setGuest(false); setAuthOpen(false); }, browseGuest: () => { setGuest(true); setAuthOpen(false); },
    logout: () => { setUser(null); setGuest(false); setAuthOpen(true); }, authOpen, setAuthOpen, saved,
    toggleSave: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), kycDone, setKycDone: (b) => { setKycDone(b); setExtraState((e) => ({ ...e, kyc: b ? "approved" : "none" })); } }}>{children}</Ctx.Provider>;
}
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error("no store"); return c; };
