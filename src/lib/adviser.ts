import { z } from "zod";
import { plans, plansFor, products } from "./data";

export const adviserInput = z.object({ needs: z.string().trim().min(10).max(1500) });
const choice = z.object({ id: z.string(), reason: z.string().max(400) });
export const adviserOutput = z.object({
  summary: z.string().max(600),
  products: z.array(choice).max(4),
  plans: z.array(choice.extend({ productId: z.string().nullable() })).max(2),
});
export type Advice = z.infer<typeof adviserOutput>;

/** Reject fabricated identifiers and incompatible contract pairings before rendering. */
export function validateAdvice(value: unknown): Advice {
  const advice = adviserOutput.parse(value);
  for (const item of advice.products) {
    if (!products.some((p) => p.id === item.id)) throw new Error("Unknown catalog item");
  }
  for (const item of advice.plans) {
    if (!plans.some((p) => p.id === item.id)) throw new Error("Unknown catalog plan");
    if (item.productId !== null) {
      const product = products.find((p) => p.id === item.productId);
      if (!product?.contractable || !plansFor(product).some((p) => p.id === item.id)) {
        throw new Error("Ineligible contract pairing");
      }
    }
  }
  return {
    ...advice,
    products: advice.products.filter((p, i, all) => all.findIndex((x) => x.id === p.id) === i),
    plans: advice.plans.filter((p, i, all) => all.findIndex((x) => x.id === p.id && x.productId === p.productId) === i),
  };
}