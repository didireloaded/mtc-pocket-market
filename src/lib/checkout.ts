import type { CartItem } from "./store";
import { isNamibiaRegion } from "./namibia";

/** Payment types are informational until an approved provider is connected. */
export const PAYMENT_METHODS = [
  { id: "wallet", label: "Mobile wallet", hint: "Account and payment integration required" },
  { id: "card", label: "Credit or debit card", hint: "Card processing not connected" },
  { id: "eft", label: "Bank transfer", hint: "No payment instructions have been issued" },
] as const;
export type PaymentId = (typeof PAYMENT_METHODS)[number]["id"];
export type Address = { name: string; street: string; town: string; region?: string; phone: string };
export const validEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

/** Splits a cart into physical and digital sections. Shipping remains unquoted until approved integration. */
export function summarize(cart: CartItem[], o: { promo: number | null; addr: Address; kycDone: boolean; esimEmail: string; payment?: PaymentId }) {
  const phys = cart.filter((i) => i.kind === "physical");
  const dig = cart.filter((i) => i.kind === "digital");
  // A contract line is an estimated recurring amount, never an amount to charge at checkout.
  const cashItems = (l: CartItem[]) => l.filter((i) => i.mode !== "contract");
  const sum = (l: CartItem[]) => cashItems(l).reduce((a, i) => a + i.price * i.qty, 0);
  const recurringMonthly = cart.filter((i) => i.mode === "contract").reduce((a, i) => a + i.price * i.qty, 0);
  const physSub = sum(phys), digSub = sum(dig);
  // No discount or courier fee can be calculated without authorised MTC policy.
  const physDisc = 0, digDisc = 0, ship = 0;
  const shipped = { items: phys, sub: physSub, disc: physDisc, ship, total: physSub - physDisc + ship };
  const digital = { items: dig, sub: digSub, disc: digDisc, total: digSub - digDisc, hasEsim: dig.some((i) => i.id === "esim") };
  const errors: string[] = [];
  if (!cart.length) errors.push("Your bag is empty.");
  if (phys.length) {
    const a = o.addr;
    if (!a.name.trim()) errors.push("Add a recipient name for shipped devices.");
    if (!a.street.trim() || !a.town.trim()) errors.push("Add a street and town for delivery.");
    if (!isNamibiaRegion(a.region)) errors.push("Choose a Namibian region for delivery.");
    if (a.phone.replace(/\D/g, "").length < 8) errors.push("Add a contact number for the courier.");
  }
  if (digital.hasEsim && !validEmail(o.esimEmail)) errors.push("Enter an email address for the eSIM demonstration. No activation email is sent.");
  if (cart.some((i) => i.mode === "contract")) errors.push("Contract applications are not available in this concept preview. Official pricing and identity verification are required.");
  // There are no real payment eligibility rules until an approved provider is integrated.
  return { shipped, digital, recurringMonthly, total: shipped.total + digital.total, errors };
}
