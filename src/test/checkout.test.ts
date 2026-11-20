import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/checkout";
import type { CartItem } from "@/lib/store";

const phone: CartItem = { key: "p", id: "nova-x", name: "Nova", variant: "", price: 1000, qty: 1, kind: "physical", mode: "cash" };
const esim: CartItem = { key: "e", id: "esim", name: "eSIM", variant: "", price: 200, qty: 1, kind: "digital" };
const addr = { name: "Jo", street: "1 Main", town: "Windhoek", phone: "0811234567" };

describe("mixed cart checkout", () => {
  it("shipping only applies to the shipped group", () => {
    const s = summarize([phone, esim], { promo: null, addr, kycDone: true, esimEmail: "a@b.na" });
    expect(s.shipped.total).toBe(1099);
    expect(s.digital.total).toBe(200);
    expect(s.total).toBe(1299);
    expect(s.errors).toEqual([]);
  });
  it("digital-only cart needs no address and no shipping", () => {
    const s = summarize([esim], { promo: null, addr: { name: "", street: "", town: "", phone: "" }, kycDone: false, esimEmail: "a@b.na" });
    expect(s.total).toBe(200);
    expect(s.errors).toEqual([]);
  });
  it("blocks when eSIM email or delivery address is missing", () => {
    const s = summarize([phone, esim], { promo: null, addr: { ...addr, phone: "" }, kycDone: true, esimEmail: "" });
    expect(s.errors).toHaveLength(2);
  });
});
