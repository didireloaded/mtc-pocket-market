import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, IdCard, ScanFace, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/kyc")({
  head: () => ({ meta: [{ title: "VERIFI Identity Check — MTC Store" }, { name: "description", content: "Verify your National ID and selfie to apply for an MTC contract." }, { property: "og:title", content: "VERIFI Identity Check — MTC Store" }, { property: "og:description", content: "Verify your National ID and selfie to apply for an MTC contract." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Kyc,
});
const steps = ["National ID — front", "National ID — back", "Selfie check"];
function Kyc() {
  const { setExtra, extra } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const done = step >= steps.length;
  const capture = () => { setBusy(true); setTimeout(() => { setBusy(false); const n = step + 1; setStep(n); if (n >= steps.length) setExtra((e) => ({ ...e, kyc: "pending" })); }, 1800); };
  const selfie = step === 2;
  return (
    <Shell nav={false}>
      <div className="px-5 pt-6 pb-10">
        <button aria-label="Back" onClick={() => router.history.back()} className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></button>
        <div className="mt-6 flex items-center gap-2"><ShieldCheck className="size-4 text-mint" /><p className="text-xs font-semibold uppercase tracking-widest text-mint">VERIFI · secure KYC</p></div>
        <h1 className="text-3xl font-bold">{done ? (extra.kyc === "approved" ? "Identity verified" : "Under review") : steps[step]}</h1>
        <div className="mt-4 flex gap-2">{steps.map((s, i) => <div key={s} className={"h-1.5 flex-1 rounded-full " + (i < step ? "bg-mint" : i === step ? "bg-primary" : "bg-surface-2")} />)}</div>
        {!done ? (<>
          <div className={"relative mx-auto mt-8 overflow-hidden border-2 border-dashed border-mint/60 bg-card " + (selfie ? "size-64 rounded-full" : "aspect-[1.58] w-full rounded-[20px]")}>
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">{selfie ? <ScanFace className="size-20" /> : <IdCard className="size-20" />}</div>
            {busy && <div className="scanline absolute inset-x-4 h-0.5 bg-mint glow-mint" />}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">{selfie ? "Center your face, remove glasses, and blink slowly." : "Place your Namibian ID inside the frame on a dark surface."}</p>
          <button disabled={busy} onClick={capture} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground glow-red disabled:opacity-60">
            {busy ? <><Loader2 className="size-5 animate-spin" />{selfie ? "Matching face…" : "Reading document…"}</> : selfie ? "Take selfie" : "Capture"}</button>
        </>) : (
          <div className="mt-10 text-center"><div className="mx-auto grid size-24 place-items-center rounded-full bg-mint/15"><ShieldCheck className="size-12 text-mint" /></div>
            <p className="mt-4 text-muted-foreground">{extra.kyc === "approved" ? "Face match 98.7% · ID valid. You're approved for contract plans." : "Documents submitted to VERIFI. Review usually takes under a minute — you can keep shopping."}</p>
            <Link to="/cart" className="mt-6 block h-14 rounded-2xl bg-mint pt-4 font-semibold text-mint-foreground">Continue to bag</Link></div>
        )}
      </div>
    </Shell>
  );
}
