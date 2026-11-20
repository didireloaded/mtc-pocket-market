import type { CartItem } from "./store";

export const SHIPPING_FEE = 99;
export type Address = { name: string; street: string; town: string; phone: string };
export const validEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

/** Splits a cart into shipped + digital fulfilment, with totals and blocking errors for checkout. */
export function summarize(cart: CartItem[], o: { promo: number | null; addr: Address; kycDone: boolean; esimEmail: string }) {
  const phys = cart.filter((i) => i.kind === "physical");
  const dig = cart.filter((i) => i.kind === "digital");
  const sum = (l: CartItem[]) => l.reduce((a, i) => a + i.price * i.qty, 0);
  const pct = o.promo ?? 0;
  const physSub = sum(phys), digSub = sum(dig);
  const physDisc = Math.round(physSub * pct), digDisc = Math.round(digSub * pct);
  const ship = phys.length ? SHIPPING_FEE : 0;
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
  if (digital.hasEsim && !validEmail(o.esimEmail)) errors.push("Add an email to receive your eSIM activation details.");
  if (cart.some((i) => i.mode === "contract") && !o.kycDone) errors.push("Complete VERIFI ID verification for contract items.");
  return { shipped, digital, total: shipped.total + digital.total, errors };
}
