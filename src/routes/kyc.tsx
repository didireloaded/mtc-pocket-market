import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FileCheck2, IdCard, ShieldCheck, Store } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/kyc")({
  head: () => ({ meta: [
    { title: "Contract verification — MTC Pocket Market" },
    { name: "description", content: "Understand the required identity checks before applying for an MTC device contract." },
    { property: "og:title", content: "Contract verification" },
    { property: "og:type", content: "website" },
  ] }),
  component: VerificationInformation,
});

function VerificationInformation() {
  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <Link to="/" aria-label="Back to Home" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <div className="mt-8 flex size-16 items-center justify-center rounded-[20px] bg-card"><ShieldCheck className="size-8 text-mint" /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-mint">Step 3 · Verify</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Your identity. Verified securely.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Applying for a device contract requires MTC's authorised identity and eligibility checks. Pocket Market's concept preview does not yet connect to MTC VERIFI.</p>
        <div className="mt-6 rounded-[22px] border border-[#90B2CC]/40 bg-[#E4EFF8] p-4 text-xs leading-5 text-[#1D4666]">
          <strong>No real verification is taking place.</strong> This demo does not capture your ID or selfie, approve applications, or create an MTC account. Do not upload sensitive identity documents here.
        </div>
        <h2 className="mt-8 text-lg font-bold">How official verification will work</h2>
        <div className="mt-3 space-y-3">
          {[
            { Icon: IdCard, title: "Provide required identification", detail: "The official service will confirm acceptable documents and required details." },
            { Icon: ShieldCheck, title: "Complete authorised VERIFI checks", detail: "Identity capture and matching happen through an approved integration, not inside an unverified demo." },
            { Icon: FileCheck2, title: "Track your application", detail: "Only actual application responses will show submitted, approved or declined statuses." },
          ].map(({ Icon, title, detail }, i) => (
            <div key={title} className="flex items-start gap-3 rounded-[20px] bg-card p-4 shadow-card">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2"><Icon className="size-5 text-mint" /></div>
              <div><p className="text-sm font-semibold">{i + 1}. {title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>
            </div>
          ))}
        </div>
        <Link to="/find" className="mt-7 flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground">Continue exploring contracts <ArrowRight className="size-4" /></Link>
        <Link to="/stores" className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold"><Store className="size-4" />View MTC collection locations</Link>
      </div>
    </Shell>
  );
}
