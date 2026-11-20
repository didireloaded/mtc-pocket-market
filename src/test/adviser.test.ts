import { describe, expect, it } from "vitest";
import { adviserInput, validateAdvice } from "../lib/adviser";

describe("Catalog-grounded AI advice", () => {
  it("rejects products outside the store catalog", () => {
    expect(() => validateAdvice({ summary: "", products: [{ id: "invented-phone", reason: "" }], plans: [] })).toThrow("Unknown catalog item");
  });
  it("rejects invented telecom plans", () => {
    expect(() => validateAdvice({ summary: "", products: [], plans: [{ id: "made-up-unlimited", reason: "", productId: null }] })).toThrow("Unknown catalog plan");
  });
  it("prevents Infinite plans being recommended for laptops", () => {
    expect(() => validateAdvice({ summary: "", products: [], plans: [{ id: "infinite-1", reason: "", productId: "macbook-air-256gb" }] })).toThrow("Ineligible contract pairing");
  });
  it("prevents financing cash-only accessories", () => {
    expect(() => validateAdvice({ summary: "", products: [], plans: [{ id: "select-go", reason: "", productId: "apple-20w-adapter" }] })).toThrow("Ineligible contract pairing");
  });
  it("allows relevant catalog devices, accessories and eligible Select plans", () => {
    const result = validateAdvice({ summary: "Study shortlist", products: [{ id: "macbook-air-256gb", reason: "Laptop" }, { id: "airpods-4", reason: "Earbuds" }], plans: [{ id: "select-go", reason: "Data", productId: "macbook-air-256gb" }] });
    expect(result.products.map((p) => p.id)).toEqual(["macbook-air-256gb", "airpods-4"]);
    expect(result.plans[0]?.id).toBe("select-go");
  });
  it("allows no match without inventing alternatives", () => {
    expect(validateAdvice({ summary: "Not in catalog", products: [], plans: [] }).products).toEqual([]);
  });
  it("validates bounded shopping descriptions", () => {
    expect(adviserInput.safeParse({ needs: "" }).success).toBe(false);
    expect(adviserInput.safeParse({ needs: "a".repeat(1501) }).success).toBe(false);
    expect(adviserInput.parse({ needs: "  Laptop for university  " }).needs).toBe("Laptop for university");
  });
});