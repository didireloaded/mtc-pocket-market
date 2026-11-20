import { describe, expect, it } from "vitest";
import { findContractMatches, type FinderOptions } from "@/lib/finder";

const base: FinderOptions = { category: "Phones", budget: 1500, months: 24, upfrontPct: 0, priority: "affordability" };

describe("budget-first device finder", () => {
  it("returns no more than three distinct products in the requested category", () => {
    const matches = findContractMatches(base);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(3);
    expect(matches.every((m) => m.product.category === "Phones")).toBe(true);
    expect(new Set(matches.map((m) => m.product.id)).size).toBe(matches.length);
  });

  it("only flags matches as affordable when they fit the requested monthly budget", () => {
    const matches = findContractMatches({ ...base, budget: 300 });
    expect(matches.every((m) => m.withinBudget === (m.monthly <= 300))).toBe(true);
    expect(matches.every((m) => m.overBudgetBy === Math.max(0, m.monthly - 300))).toBe(true);
  });

  it("shows separately the upfront amount and the complete commitment", () => {
    const matches = findContractMatches(base);
    for (const match of matches) {
      expect(match.totalOverTerm).toBeCloseTo(match.payToday + match.monthly * base.months, 2);
      expect(match.monthly).toBeCloseTo(match.deviceMonthly + match.planMonthly, 2);
      expect(match.payToday).toBeGreaterThanOrEqual(0);
    }
  });

  it("changes estimated instalments as the upfront contribution changes", () => {
    const noUpfront = findContractMatches({ ...base, budget: 9000 })[0]!;
    const someUpfront = findContractMatches({ ...base, budget: 9000, upfrontPct: 0.3 })
      .find((m) => m.product.id === noUpfront.product.id)!;
    expect(someUpfront.deviceMonthly).toBeLessThan(noUpfront.deviceMonthly);
    expect(someUpfront.payToday).toBeGreaterThan(noUpfront.payToday);
  });

  it("matches laptop devices with plans eligible for laptop contracts", () => {
    const matches = findContractMatches({ ...base, category: "Laptops" });
    expect(matches.every((m) => m.product.category === "Laptops" && m.plan.laptop)).toBe(true);
  });
});
