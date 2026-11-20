import type { Order } from "./store";

/** Browser-local preview orders never advance to shipping or claim real fulfilment. */
export const STAGES = ["Saved locally"] as const;
export type Stage = (typeof STAGES)[number];

export function timeline(order: Order, _now: number) {
  if (!order.items.some((item) => item.kind === "physical")) return [];
  return [{
    stage: "Saved locally" as Stage,
    at: order.placedAt,
    reached: true,
    note: "Saved on this device for demonstration only. No payment, courier dispatch or MTC fulfilment has occurred.",
  }];
}

export const currentStage = (order: Order, now: number) => timeline(order, now)[0]?.stage;
