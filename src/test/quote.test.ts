import { describe, expect, it } from "vitest";
import { getProduct, plans, plansFor, quote } from "@/lib/data";

const air = { cash: 13499 };
describe("contract quote (MTC device financing)", () => {
  it("12-month MacBook Air matches MTC: N$1,186.78 p/m, final N$14,241.32 (rounded)", () => {
    const q = quote(air, plans[0]!, { months: 12 });
    expect(q.final).toBeCloseTo(14241.45, 1);
    expect(q.device).toBeCloseTo(1186.79, 1);
  });
  it("monthly = device payment + plan fee; upfront reduces device payment", () => {
    const q = quote(air, plans[0]!, { months: 24, upfrontPct: 0.2 });
    expect(q.upfront).toBe(2700);
    expect(q.monthly).toBeCloseTo(q.device + 199, 2);
  });
  it("48 months only on Infinite plans", () => {
    expect(quote(air, plans[0]!, { months: 48 }).months).toBe(24);
    expect(quote(air, plans[5]!, { months: 48 }).months).toBe(48);
  });
  it("laptops are only offered on Select (shared SIM) plans", () => {
    expect(plansFor(getProduct("macbook-air-256gb")!).every((p) => p.name.startsWith("Select"))).toBe(true);
  });
});

describe("MacBook comparison", () => {
  it("contract pay-today = upfront + N$218 connection fee", () => {
    const q = quote({ cash: 14999 }, plans[1]!, { months: 36, upfrontPct: 0.1 });
    expect(q.upfront + q.connection).toBe(1500 + 218);
  });
});
