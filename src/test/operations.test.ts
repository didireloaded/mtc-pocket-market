import { describe, expect, it } from "vitest";
import { orderRequest, priceOrder } from "@/lib/operations";
import { products } from "@/lib/data";
describe("Cloud order requests", () => {
  const address = { name: "Test Shopper", street: "1 Test Street", town: "Windhoek", phone: "0812345678" };
  it("uses catalog cash prices instead of browser-supplied prices", () => {
    const p = products[0];
    if (!p) throw new Error("Catalog required");
    expect(priceOrder(orderRequest.parse({ items: [{ id: p.id, qty: 2, price: 1 }], address })).total).toBe(p.cash * 2);
  });
  it("rejects products outside the MTC catalog", () => {
    expect(() => priceOrder({ items: [{ id: "invented", qty: 1 }], address })).toThrow();
  });
  it("rejects zero quantity", () => {
    expect(orderRequest.safeParse({ items: [{ id: "device", qty: 0 }], address }).success).toBe(false);
  });
});