import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { orderRequest, priceOrder } from "./operations";

export const loadOperations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: staff } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  const [orders, events, kyc, returns] = await Promise.all([
    context.supabase.from("orders").select("*").order("created_at", { ascending: false }),
    context.supabase.from("order_events").select("*").order("created_at", { ascending: true }),
    context.supabase.from("kyc_cases").select("*").order("created_at", { ascending: false }),
    context.supabase.from("return_requests").select("*").order("created_at", { ascending: false }),
  ]);
  const error = orders.error || events.error || kyc.error || returns.error;
  if (error) throw new Error(error.message);
  return { staff: Boolean(staff), orders: orders.data ?? [], events: events.data ?? [], kyc: kyc.data ?? [], returns: returns.data ?? [] };
});

export const submitOrderRequest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => orderRequest.parse(i)).handler(async ({ context, data }) => {
  const priced = priceOrder(data);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order, error } = await supabaseAdmin.from("orders").insert({ user_id: context.userId, items: priced.items, total: priced.total, address: data.address }).select("id").single();
  if (error || !order) throw new Error(error?.message ?? "Could not save your request.");
  const event = await supabaseAdmin.from("order_events").insert({ order_id: order.id, actor_id: context.userId, stage: "awaiting_payment", note: "Order request received. No payment collected; stock and delivery costs require confirmation." });
  if (event.error) throw new Error(event.error.message);
  return order.id;
});

export const submitKycReference = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({ reference: z.string().trim().min(3).max(150) }).parse(i)).handler(async ({ context, data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("kyc_cases").insert({ user_id: context.userId, reference: data.reference });
  if (error) throw new Error(error.message);
});

export const submitReturn = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({ orderId: z.string().uuid(), reason: z.string().trim().min(10).max(1000) }).parse(i)).handler(async ({ context, data }) => {
  const { data: order } = await context.supabase.from("orders").select("id,user_id,status").eq("id", data.orderId).single();
  if (!order || order.user_id !== context.userId || order.status !== "delivered") throw new Error("Returns can be requested for your delivered orders only.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("return_requests").insert({ order_id: order.id, user_id: context.userId, reason: data.reason });
  if (error) throw new Error(error.code === "23505" ? "This order already has an open return." : error.message);
});

export const processOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({ id: z.string().uuid(), status: z.enum(["processing", "shipped", "out_for_delivery", "delivered", "cancelled"]), tracking: z.string().max(100), note: z.string().max(1000) }).parse(i)).handler(async ({ context, data }) => {
  const { error } = await context.supabase.rpc("process_order", { _id: data.id, _status: data.status, _tracking: data.tracking, _note: data.note });
  if (error) throw new Error(error.message);
});
export const reviewCase = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({ id: z.string().uuid(), kind: z.enum(["kyc", "return"]), status: z.enum(["approved", "rejected", "received", "closed"]), note: z.string().trim().min(1).max(1000) }).parse(i)).handler(async ({ context, data }) => {
  const { error } = await context.supabase.rpc("review_case", { _id: data.id, _kind: data.kind, _status: data.status, _note: data.note });
  if (error) throw new Error(error.message);
});