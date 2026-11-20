import { z } from "zod";
import { getProduct } from "./data";
import { NAMIBIA_REGIONS } from "./namibia";
export const orderRequest = z.object({ items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20) })).min(1).max(30), address: z.object({ name: z.string().trim().min(1).max(100), street: z.string().trim().min(1).max(200), town: z.string().trim().min(1).max(100), region: z.enum(NAMIBIA_REGIONS).optional(), phone: z.string().trim().min(8).max(30) }) });
export function priceOrder(input: z.infer<typeof orderRequest>) {
  const items = input.items.map((i) => {
    const p = getProduct(i.id);
    if (!p) throw new Error("Choose a device from the MTC catalog.");
    return { id: p.id, name: p.name, qty: i.qty, price: p.cash };
  });
  return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
}
export const nextOrderStatus: Record<string, string> = { awaiting_payment: "processing", processing: "shipped", shipped: "out_for_delivery", out_for_delivery: "delivered" };
export const statusLabel = (s: string) => s.replaceAll("_", " ");