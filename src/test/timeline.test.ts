import { describe, expect, it } from "vitest";
import { STEP_MS, currentStage, timeline } from "@/lib/timeline";
import type { Order } from "@/lib/store";

const o: Order = { id: "MTC1", placedAt: 0, items: [{ name: "Nova", qty: 1, kind: "physical" }], total: 1, address: "Windhoek", tracking: "NP1", shippedTotal: 1, digitalTotal: 0, esimEmail: "" };
describe("order timeline", () => {
  it("moves processing → shipped → out for delivery", () => {
    expect(currentStage(o, 0)).toBe("Processing");
    expect(currentStage(o, STEP_MS)).toBe("Shipped");
    expect(currentStage(o, STEP_MS * 2 + 5)).toBe("Out for delivery");
  });
  it("digital-only orders have no delivery timeline", () => {
    expect(timeline({ ...o, items: [{ name: "eSIM", qty: 1, kind: "digital" }] }, 999999)).toEqual([]);
  });
});
