import { describe, expect, it } from "vitest";
import { plans, quote } from "@/lib/data";

describe("contract quote", () => {
  it("monthly = device payment + plan fee", () => {
    const q = quote({ cash: 2400, contract: 0 }, plans[0]!);
    expect(q.device).toBe(115);
    expect(q.monthly).toBe(115 + 199);
  });
  it("upfront is taken off before spreading over the term", () => {
    const q = quote({ cash: 2400, contract: 0 }, plans[2]!);
    expect(q.upfront).toBe(240);
    expect(q.device).toBe(Math.round((2160 / 24) * 1.15));
  });
});
