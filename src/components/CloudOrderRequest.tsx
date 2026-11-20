import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, CloudOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { submitOrderRequest } from "@/lib/operations.functions";

type Address = { name: string; street: string; town: string; phone: string };
const fields: { key: keyof Address; label: string; autoComplete: string; type?: string }[] = [
  { key: "name", label: "Recipient name", autoComplete: "name" },
  { key: "street", label: "Street address", autoComplete: "street-address" },
  { key: "town", label: "Town", autoComplete: "address-level2" },
  { key: "phone", label: "Contact number", autoComplete: "tel", type: "tel" },
];

export function CloudOrderRequest() {
  const { cart, user, setAuthOpen } = useStore();
  const submit = useServerFn(submitOrderRequest);
  const cache = useQueryClient();
  const [address, setAddress] = useState<Address>({ name: "", street: "", town: "", phone: "" });
  const eligible = cart.length > 0 && cart.every((item) => item.kind === "physical" && item.mode !== "contract");

  const mutation = useMutation({
    mutationFn: () => {
      if (!window.navigator.onLine) throw new Error("offline");
      return submit({ data: { items: cart.map((item) => ({ id: item.id, qty: item.qty })), address } });
    },
    onSuccess: () => { void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); },
  });

  if (!eligible) return null;
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mutation.isPending && !mutation.isSuccess) mutation.mutate();
  };

  return <section className="mt-5 rounded-[22px] border border-border bg-card p-4" aria-labelledby="cloud-request-title">
    <h2 id="cloud-request-title" className="text-[17px] font-bold">Save an account-linked order request</h2>
    <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
      No payment will be collected. Stock, delivery charges and final availability still require confirmation.
    </p>

    {!user ? <Button type="button" onClick={() => setAuthOpen(true)} className="mt-4 min-h-12 rounded-full text-[14px]">
      Sign in to submit a request
    </Button> : mutation.isSuccess ? <div role="status" className="mt-4 rounded-[16px] bg-surface-2 p-4">
      <CheckCircle2 aria-hidden="true" className="size-6 text-mint" />
      <p className="mt-2 text-[15px] font-semibold">Your order request is saved</p>
      <p className="mt-1 text-[13px] leading-5 text-muted-foreground">This is an account request, not confirmation of a paid order.</p>
      <Button asChild className="mt-4 min-h-11 rounded-full"><Link to="/orders">View account requests</Link></Button>
    </div> : <form onSubmit={onSubmit} className="mt-5 space-y-4">
      {fields.map(({ key, label, type, autoComplete }) => <div key={key}>
        <label htmlFor={`request-${key}`} className="mb-1.5 block text-[14px] font-semibold">{label}</label>
        <input id={`request-${key}`} type={type ?? "text"} inputMode={key === "phone" ? "tel" : "text"}
          autoComplete={autoComplete} required minLength={key === "phone" ? 8 : 1}
          value={address[key]} onChange={(event) => setAddress((prev) => ({ ...prev, [key]: event.target.value }))}
          placeholder={label} className="h-12 w-full rounded-[14px] border border-border bg-background px-4 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-mint" />
      </div>)}

      {mutation.isError && <div role="alert" className="flex items-start gap-2 rounded-[14px] bg-destructive/10 p-3 text-[13px] leading-5 text-destructive">
        <CloudOff aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <p>{mutation.error instanceof Error && mutation.error.message === "offline"
          ? "You're offline. Connect to the internet and try again. Your form is still here."
          : "We couldn't confirm that your request was saved. Check your account requests before trying again to avoid duplicates."}</p>
      </div>}
      <Button type="submit" disabled={mutation.isPending} className="min-h-12 w-full rounded-full text-[14px] font-semibold">
        {mutation.isPending ? <><Loader2 aria-hidden="true" className="size-4 animate-spin" />Submitting…</> : "Save order request"}
      </Button>
    </form>}
  </section>;
}
