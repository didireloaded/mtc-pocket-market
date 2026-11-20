import type * as React from "react";
import { supabase } from "@/integrations/supabase/client";
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
const defaultExtra: Extra = { onboarded: false, recent: [], searches: [], addresses: [{ label: "Home", name: "", street: "", town: "", phone: "" }],
  kyc: "none", prefs: { orders: true, priceDrops: true, lowBalance: true }, numbers: [], biometric: false };
type Store = {
  ready: boolean; authReady: boolean; cart: CartItem[]; add: (i: Omit<CartItem, "qty" | "key">) => void; setQty: (k: string, q: number) => void; remove: (k: string) => void; clear: () => void;
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
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("mtc") || "{}");
      if (s.cart) setCart(s.cart); if (Array.isArray(s.orders)) setOrders(s.orders.filter((o: Order) => Boolean(o && typeof o.id === "string"))); if (s.notices) setNotices(s.notices); if (s.extra) setExtraState({ ...defaultExtra, ...s.extra }); if (s.guest) setGuest(true); if (s.saved) setSaved(s.saved); if (s.kycDone) setKycDone(true);
      // Browsing never requires an authentication prompt. The visitor chooses when to sign in.
    } catch { /* first visit: welcome screens show first */ }
    setReady(true);
  }, []);
  useEffect(() => { if (!ready) return; try { localStorage.setItem("mtc", JSON.stringify({ cart, guest, saved, kycDone, orders, notices, extra })); } catch { console.warn("Pocket Market could not save browsing data on this device."); } }, [cart, guest, saved, kycDone, orders, notices, extra, ready]);
  // Real accounts: the signed-in user always comes from the auth session.
  useEffect(() => {
    const apply = (u: { email?: string | null; user_metadata?: { full_name?: string } } | null | undefined) =>
      setUser(u ? { label: u.email || u.user_metadata?.full_name || "MTC customer", method: "email" } : null);
    supabase.auth.getSession()
      .then(({ data }) => { apply(data.session?.user); if (data.session) { setGuest(false); setAuthOpen(false); } })
      .catch(() => { /* Offline guests can still browse the local catalogue. */ })
      .finally(() => setAuthReady(true));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      apply(session?.user);
      setAuthReady(true);
      if (event === "SIGNED_IN") { setGuest(false); setAuthOpen(false); }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  // Browser demo orders never generate fake shipping or push notifications.
  const add: Store["add"] = (i) => setCart((c) => {
    const key = `${i.id}-${i.variant}-${i.mode ?? ""}`;
    const ex = c.find((x) => x.key === key);
    return ex ? c.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...i, key, qty: 1 }];
  });
  return <Ctx.Provider value={{ ready, authReady, cart, add, setQty: (k, q) => setCart((c) => q < 1 ? c.filter((x) => x.key !== k) : c.map((x) => (x.key === k ? { ...x, qty: q } : x))),
    remove: (k) => setCart((c) => c.filter((x) => x.key !== k)), clear: () => setCart([]), mode, setMode, user, guest,
    orders, placeOrder: (o) => { const id = "DEMO-" + Date.now().toString(36).toUpperCase(); setOrders((x) => [{ ...o, id, tracking: "", placedAt: Date.now() }, ...x]); return id; },
    extra, setExtra: setExtraState, viewProduct: (id) => setExtraState((e) => ({ ...e, recent: [id, ...e.recent.filter((x) => x !== id)].slice(0, 8) })),
    notices, markAllRead: () => setNotices((n) => n.map((x) => ({ ...x, read: true }))),
    login: (u) => { setUser(u); setGuest(false); setAuthOpen(false); }, browseGuest: () => { setGuest(true); setAuthOpen(false); },
    logout: () => { void supabase.auth.signOut(); setUser(null); setGuest(true); setAuthOpen(false); }, authOpen, setAuthOpen, saved,
    toggleSave: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), kycDone, setKycDone: (b) => { setKycDone(b); setExtraState((e) => ({ ...e, kyc: b ? "approved" : "none" })); } }}>{children}</Ctx.Provider>;
}
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error("no store"); return c; };
