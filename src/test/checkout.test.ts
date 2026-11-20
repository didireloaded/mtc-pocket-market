import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/checkout";
import type { CartItem } from "@/lib/store";

const phone: CartItem = { key: "p", id: "nova-x", name: "Nova", variant: "", price: 1000, qty: 1, kind: "physical", mode: "cash" };
const esim: CartItem = { key: "e", id: "esim", name: "eSIM", variant: "", price: 200, qty: 1, kind: "digital" };
const addr = { name: "Jo", street: "1 Main", town: "Windhoek", region: "Khomas", phone: "0811234567" };

describe("checkout preparation without active payment gateway", () => {
  it("calculates item subtotals without inventing shipping, fees or discounts", () => {
    const s = summarize([phone, esim], { promo: null, addr, kycDone: true, esimEmail: "a@b.na" });
    expect(s.shipped.sub).toBe(1000);
    expect(s.shipped.ship).toBe(0);
    expect(s.shipped.disc).toBe(0);
    expect(s.digital.total).toBe(200);
    expect(s.total).toBe(1200);
    expect(s.errors).toEqual([]);
  });

  it("does not require a physical address for a digital-only cart", () => {
    const s = summarize([esim], { promo: null, addr: { name: "", street: "", town: "", phone: "" }, kycDone: false, esimEmail: "a@b.na" });
    expect(s.total).toBe(200);
    expect(s.errors).toEqual([]);
  });

  it("validates a Namibian region and delivery phone number", () => {
    const missingRegion = summarize([phone], { promo: null, addr: { ...addr, region: "" }, kycDone: true, esimEmail: "" });
    expect(missingRegion.errors.some((message) => message.includes("Namibian region"))).toBe(true);
    const invalid = summarize([phone, esim], { promo: null, addr: { ...addr, phone: "" }, kycDone: true, esimEmail: "" });
    expect(invalid.errors).toHaveLength(2);
    expect(summarize([phone], { promo: null, addr, kycDone: true, esimEmail: "" }).errors).toEqual([]);
  });

  it("does not simulate wallet balances or bank transfer restrictions", () => {
    expect(summarize([phone], { promo: null, addr, kycDone: true, esimEmail: "", payment: "eft" }).errors).toEqual([]);
    expect(summarize([phone], { promo: null, addr, kycDone: true, esimEmail: "", payment: "wallet" }).errors).toEqual([]);
  });

  it("does not charge estimated monthly contract amounts as one-off payments", () => {
    const contract: CartItem = { ...phone, key: "contract", price: 1250, mode: "contract" };
    const s = summarize([contract], { promo: null, addr, kycDone: true, esimEmail: "" });
    expect(s.recurringMonthly).toBe(1250);
    expect(s.total).toBe(0);
    expect(s.errors.some((error) => error.includes("Contract applications are not available"))).toBe(true);
  });
});
