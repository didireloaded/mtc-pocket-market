import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Info, QrCode, Smartphone, Wifi } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/esim")({
  head: () => ({ meta: [
    { title: "eSIM guidance — MTC Pocket Market" },
    { name: "description", content: "Understand eSIM compatibility and official MTC activation requirements." },
    { property: "og:title", content: "eSIM guidance — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: EsimInformation,
});

function EsimInformation() {
  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <Link to="/" aria-label="Back to Home" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <div className="mt-7 grid size-16 place-items-center rounded-[20px] bg-card"><QrCode className="size-8 text-mint" /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-mint">Connectivity</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight">Get ready for an eSIM.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Explore how an eSIM works, check your device and learn how to activate through an authorised MTC service.</p>
        <div className="mt-6 flex gap-3 rounded-[20px] border border-[#90B2CC]/40 bg-[#E4EFF8] p-4 text-[#1D4666]">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p className="text-xs leading-5"><strong>Concept preview.</strong> Pocket Market cannot issue an activation code or provision an eSIM yet. No QR code is generated here, because a simulated code cannot activate a mobile line.</p>
        </div>
        <h2 className="mt-7 text-lg font-bold">Before you activate</h2>
        <div className="mt-3 space-y-3">
          {[
            { Icon: Smartphone, text: "Check whether your phone supports eSIM in its mobile network settings." },
            { Icon: Wifi, text: "Connect to a stable Wi-Fi network when installing an authorised activation profile." },
            { Icon: CheckCircle2, text: "Obtain your actual activation details from an official MTC channel." },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-3 rounded-[20px] bg-card p-4 shadow-card">
              <Icon className="mt-0.5 size-5 shrink-0 text-mint" /><p className="text-sm leading-6">{text}</p>
            </div>
          ))}
        </div>
        <a href="https://www.mtc.com.na" target="_blank" rel="noreferrer" className="mt-7 flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground">Visit MTC for official eSIM options <ArrowUpRight className="size-4" /></a>
        <Link to="/stores" className="mt-3 flex h-12 items-center justify-center rounded-full border text-sm font-semibold">Explore collection locations</Link>
      </div>
    </Shell>
  );
}
