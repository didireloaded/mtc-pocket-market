import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { submitOrderRequest } from "@/lib/operations.functions";

export function CloudOrderRequest() {
  const { cart, user, setAuthOpen } = useStore();
  const submit = useServerFn(submitOrderRequest), cache = useQueryClient();
  const [address, setAddress] = useState({ name: "", street: "", town: "", phone: "" });
  const eligible = cart.length > 0 && cart.every((i) => i.kind === "physical" && i.mode !== "contract");
  const mutation = useMutation({ mutationFn: () => submit({ data: { items: cart.map((i) => ({ id: i.id, qty: i.qty })), address } }), onSuccess: () => { void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); } });
  if (!eligible) return null;
  return <section className="mt-5 rounded-[20px] border bg-card p-4"><h2 className="font-semibold">Save a Cloud order request</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">No payment is collected. Device prices are saved from the catalog; stock, shipping and payment require confirmation.</p>
    {!user ? <Button onClick={() => setAuthOpen(true)} className="mt-3 rounded-full">Sign in to save your request</Button> : mutation.isSuccess ? <div role="status" className="mt-3"><p className="text-sm text-mint">Order request saved to your account.</p><Button asChild className="mt-3 rounded-full"><Link to="/orders">View Cloud order</Link></Button></div> : <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-3 space-y-2">{(["name", "street", "town", "phone"] as const).map((key) => <input key={key} required aria-label={`Order request ${key}`} placeholder={key === "name" ? "Recipient name" : key === "street" ? "Street address" : key === "town" ? "Town" : "Contact number"} value={address[key]} onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))} className="h-11 w-full rounded-xl border bg-background px-3 text-sm" />)}<Button disabled={mutation.isPending} className="w-full rounded-full">{mutation.isPending ? "Saving…" : "Save order request"}</Button>{mutation.error && <p role="alert" className="text-xs text-destructive">{mutation.error.message}</p>}</form>}
  </section>;
}