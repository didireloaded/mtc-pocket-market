import type { CartItem } from "./store";

// Illustrative demo figures only. Not authorised MTC shipping or promotional policies.
export const SHIPPING_FEE = 99;
export const FREE_SHIPPING_OVER = 5000;
export const PROMOS: Record<string, number> = { MTC10: 0.1, MTCSUMMER: 0.15 };
export const PAYMENT_METHODS = [
  { id: "wallet", label: "Wallet (demo only)", hint: "No real account balance connected" },
  { id: "card", label: "Card (demo only)", hint: "No card information collected" },
  { id: "ewallet", label: "Mobile wallet (demo only)", hint: "Not connected to a payment provider" },
  { id: "eft", label: "Bank transfer (demo only)", hint: "No payment is initiated" },
] as const;
export type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];
export type Address = { name: string; street: string; town: string; phone: string };
export const validEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

/** Splits a cart into shipped + digital fulfilment, with totals and blocking errors for checkout. */
export function summarize(cart: CartItem[], o: { promo: number | null; addr: Address; kycDone: boolean; esimEmail: string; payment?: PaymentId }) {
  const phys = cart.filter((i) => i.kind === "physical");
  const dig = cart.filter((i) => i.kind === "digital");
  // A contract line is an estimated recurring amount, never an amount to charge at checkout.
  const cashItems = (l: CartItem[]) => l.filter((i) => i.mode !== "contract");
  const sum = (l: CartItem[]) => cashItems(l).reduce((a, i) => a + i.price * i.qty, 0);
  const recurringMonthly = cart.filter((i) => i.mode === "contract").reduce((a, i) => a + i.price * i.qty, 0);
  const pct = o.promo ?? 0;
  const physSub = sum(phys), digSub = sum(dig);
  const physDisc = Math.round(physSub * pct), digDisc = Math.round(digSub * pct);
  const ship = cashItems(phys).length && physSub - physDisc < FREE_SHIPPING_OVER ? SHIPPING_FEE : 0;
  const shipped = { items: phys, sub: physSub, disc: physDisc, ship, total: physSub - physDisc + ship };
  const digital = { items: dig, sub: digSub, disc: digDisc, total: digSub - digDisc, hasEsim: dig.some((i) => i.id === "esim") };
  const errors: string[] = [];
  if (!cart.length) errors.push("Your bag is empty.");
  if (phys.length) {
    const a = o.addr;
    if (!a.name.trim()) errors.push("Add a recipient name for shipped devices.");
    if (!a.street.trim() || !a.town.trim()) errors.push("Add a street and town for delivery.");
    if (a.phone.replace(/\D/g, "").length < 8) errors.push("Add a contact number for the courier.");
  }
  if (digital.hasEsim && !validEmail(o.esimEmail)) errors.push("Enter an email address for the eSIM demonstration. No activation email is sent.");
  if (cart.some((i) => i.mode === "contract")) errors.push("Contract applications are not available in this concept preview. Official pricing and identity verification are required.");
  // There are no real payment eligibility rules until an approved provider is integrated.
  return { shipped, digital, recurringMonthly, total: shipped.total + digital.total, errors };
}
