import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { loadOperations, submitKycReference } from "@/lib/operations.functions";
export function KycReference() {
  const { user, setAuthOpen } = useStore();
  const [reference, setReference] = useState("");
  const load = useServerFn(loadOperations), submit = useServerFn(submitKycReference), cache = useQueryClient();
  const query = useQuery({ queryKey: ["cloud-operations", user?.label], queryFn: () => load(), enabled: Boolean(user) });
  const mutation = useMutation({ mutationFn: () => submit({ data: { reference } }), onSuccess: () => { setReference(""); void cache.invalidateQueries({ queryKey: ["cloud-operations"] }); } });
  return <section className="mt-6 rounded-[20px] border bg-card p-4"><h2 className="font-semibold">Request staff review</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Already completed identification through MTC? Submit your official reference for staff review. Do not enter ID numbers or upload documents.</p>
    {!user ? <Button onClick={() => setAuthOpen(true)} className="mt-3 rounded-full">Sign in</Button> : <><form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}><input aria-label="Official MTC verification reference" minLength={3} maxLength={150} required value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Official MTC reference" className="h-11 w-full rounded-xl border bg-background px-3 text-sm" /><Button disabled={mutation.isPending} className="w-full rounded-full">Submit for review</Button></form>{mutation.error && <p role="alert" className="mt-3 text-xs text-destructive">{mutation.error.message}</p>}{mutation.isSuccess && <p role="status" className="mt-3 text-sm text-mint">Reference saved for staff review.</p>}{query.data?.kyc.map((k) => <p key={k.id} className="mt-3 text-xs">{k.reference} · {k.status}{k.review_note && ` · ${k.review_note}`}</p>)}</>}
  </section>;
}