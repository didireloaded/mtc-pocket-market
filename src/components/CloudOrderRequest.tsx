import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, CloudOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { submitOrderRequest } from "@/lib/operations.functions";
import { NamibiaAddressFields, type NamibiaAddress } from "@/components/NamibiaAddressFields";
import { isNamibiaRegion } from "@/lib/namibia";

export function CloudOrderRequest() {
  const { cart, user, setAuthOpen, extra } = useStore();
  const submit = useServerFn(submitOrderRequest);
  const cache = useQueryClient();
  const [address, setAddress] = useState<NamibiaAddress>(() => {
    const saved = extra.addresses[0];
    return saved
      ? { name: saved.name, street: saved.street, town: saved.town, region: saved.region ?? "", phone: saved.phone }
      : { name: "", street: "", town: "", region: "", phone: "" };
  });
  const eligible = cart.length > 0 && cart.every((item) => item.kind === "physical" && item.mode !== "contract");

  const mutation = useMutation({
    mutationFn: () => {
      if (!window.navigator.onLine) throw new Error("offline");
      if (!isNamibiaRegion(address.region)) throw new Error("region");
      return submit({ data: {
        items: cart.map((item) => ({ id: item.id, qty: item.qty })),
        address: { name: address.name, street: address.street, town: address.town, region: address.region, phone: address.phone },
      } });
    },
    onSuccess: () => { void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); },
  });

  if (!eligible) return null;
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mutation.isPending && !mutation.isSuccess) mutation.mutate();
  };

  return <section className="mt-5 rounded-[22px] border border-border bg-card p-4" aria-labelledby="cloud-request-title">
    <h2 id="cloud-request-title" className="text-[17px] font-bold">Submit an account request</h2>
    <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
      Submit your chosen devices for follow-up. This saves an account-linked request, not a purchase. No payment is collected, and stock and delivery need confirmation.
    </p>

    {!user ? <Button type="button" onClick={() => setAuthOpen(true)} className="mt-4 min-h-12 rounded-full text-[14px]">
      Sign in to submit a request
    </Button> : mutation.isSuccess ? <div role="status" className="mt-4 rounded-[16px] bg-surface-2 p-4">
      <CheckCircle2 aria-hidden="true" className="size-6 text-mint" />
      <p className="mt-2 text-[15px] font-semibold">Your request was saved</p>
      <p className="mt-1 text-[13px] leading-5 text-muted-foreground">The request is saved to your Pocket Market account. Payment and fulfilment have not started.</p>
      <Button asChild className="mt-4 min-h-11 rounded-full"><Link to="/orders">View your requests</Link></Button>
    </div> : <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <NamibiaAddressFields prefix="request" value={address} onChange={setAddress} />
      {mutation.isError && <div role="alert" className="flex items-start gap-2 rounded-[14px] bg-destructive/10 p-3 text-[13px] leading-5 text-destructive">
        <CloudOff aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <p>{mutation.error instanceof Error && mutation.error.message === "offline"
          ? "You're offline. Reconnect and try again. Your form is still here."
          : mutation.error instanceof Error && mutation.error.message === "region"
          ? "Choose a Namibian region for this address."
          : "We couldn't confirm that your request was saved. Check your account requests before trying again to avoid duplicates."}</p>
      </div>}
      <Button type="submit" disabled={mutation.isPending} className="min-h-12 w-full rounded-full text-[14px] font-semibold">
        {mutation.isPending ? <><Loader2 aria-hidden="true" className="size-4 animate-spin" />Submitting…</> : "Submit account request"}
      </Button>
    </form>}
  </section>;
}
