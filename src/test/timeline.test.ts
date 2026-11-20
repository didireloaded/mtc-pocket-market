import { describe, expect, it } from "vitest";
import { currentStage, timeline } from "@/lib/timeline";
import type { Order } from "@/lib/store";

const order: Order = {
  id: "DEMO-1", placedAt: 12345,
  items: [{ name: "Phone", qty: 1, kind: "physical" }],
  total: 1000, address: "Windhoek", tracking: "", shippedTotal: 1000,
  digitalTotal: 0, esimEmail: "",
};

describe("browser-local order timeline", () => {
  it("never marks local demo orders shipped, delivered or paid", () => {
    const statuses = timeline(order, Date.now() + 365 * 24 * 60 * 60 * 1000);
    expect(statuses).toHaveLength(1);
    expect(statuses[0]?.stage).toBe("Saved locally");
    expect(statuses[0]?.note).toContain("No payment");
    expect(currentStage(order, Date.now())).toBe("Saved locally");
  });

  it("does not invent a delivery timeline for an eSIM preview", () => {
    expect(timeline({
      ...order, items: [{ name: "eSIM", qty: 1, kind: "digital" }],
    }, Date.now())).toEqual([]);
  });
});
