import type { Order } from "./store";

export const STEP_MS = 120_000; // demo: each delivery stage advances every 2 minutes
export const STAGES = ["Processing", "Shipped", "Out for delivery"] as const;
export type Stage = (typeof STAGES)[number];

/** Single source of truth for an order's delivery progress. */
export function timeline(o: Order, now: number) {
  if (!o.items.some((i) => i.kind === "physical")) return [];
  const notes: Record<Stage, string> = {
    Processing: "Payment received. Preparing your devices at MTC warehouse, Windhoek.",
    Shipped: `Handed to courier · Tracking ${o.tracking}`,
    "Out for delivery": `On the way to ${o.address}`,
  };
  return STAGES.map((stage, i) => {
    const at = o.placedAt + i * STEP_MS;
    return { stage, at, reached: now >= at, note: notes[stage] };
  });
}
export const currentStage = (o: Order, now: number) => timeline(o, now).filter((e) => e.reached).at(-1)?.stage;
