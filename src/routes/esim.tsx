import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Smartphone, CheckCircle2, Copy } from "lucide-react";
import { EsimEmail } from "@/components/EsimEmail";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/esim")({
  head: () => ({ meta: [{ title: "Activate eSIM — MTC Store" }, { name: "description", content: "Scan your MTC eSIM QR code to get connected in minutes." }, { property: "og:title", content: "Activate eSIM — MTC Store" }, { property: "og:description", content: "Scan your MTC eSIM QR code to get connected in minutes." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Esim,
});
function Esim() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };
  const [code] = useState(() => "LPA:1$sm-dp.mtc.com.na$" + Math.random().toString(36).slice(2, 14).toUpperCase());
  return (
    <Shell nav={false}>
      <div className="px-5 pt-6">
        <Link to="/mymtc" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-mint">eSIM activation</p>
        <h1 className="text-3xl font-bold">{["Check your device", "Scan to install", "You're connected"][step]}</h1>
        {step === 0 && (<div className="mt-6 space-y-3">
          {["Device supports eSIM (Settings → Cellular)", "Connected to Wi‑Fi", "Device is carrier-unlocked"].map((t) => <div key={t} className="flex items-center gap-3 rounded-[20px] bg-card p-4 text-sm"><CheckCircle2 className="size-5 text-mint" />{t}</div>)}
          <button onClick={() => setStep(1)} className="mt-4 h-14 w-full rounded-2xl bg-primary font-semibold text-primary-foreground glow-red">Generate my QR code</button>
        </div>)}
        {step === 1 && (<div className="mt-6">
          <div className="mx-auto w-fit rounded-[28px] bg-foreground p-5 glow-mint"><QRCodeSVG value={code} size={220} bgColor="transparent" fgColor="currentColor" className="text-background" level="M" /></div>
          <p className="mt-4 text-center text-sm text-muted-foreground">On your phone: Settings → Cellular → Add eSIM → Use QR code</p>
          <div className="mt-4 rounded-2xl bg-card p-4">
            <p className="text-xs text-muted-foreground">On this phone? Copy the SM-DP+ activation code</p>
            <div className="mt-2 flex items-center gap-2"><p className="flex-1 break-all font-mono text-xs">{code}</p>
              <button onClick={copy} className="flex shrink-0 items-center gap-1 rounded-full bg-mint px-3 py-2 text-xs font-bold text-mint-foreground"><Copy className="size-3" />{copied ? "Copied" : "Copy"}</button></div>
            <p className="mt-2 text-[11px] text-muted-foreground">iPhone: Settings → Mobile Service → Add eSIM → Enter details manually. Android: Settings → SIMs → Add eSIM → Enter code.</p>
          </div>
          <div className="mt-3"><EsimEmail /></div>
          <button onClick={() => setStep(2)} className="mt-4 h-14 w-full rounded-2xl bg-mint font-semibold text-mint-foreground">I've scanned it</button>
        </div>)}
        {step === 2 && (<div className="mt-10 text-center"><div className="mx-auto grid size-24 place-items-center rounded-full bg-mint/15"><Smartphone className="size-10 text-mint" /></div>
          <p className="mt-4 text-muted-foreground">Your MTC eSIM is active. 10 GB ready to use.</p>
          <Link to="/" className="mt-6 block h-14 rounded-2xl bg-primary pt-4 font-semibold text-primary-foreground">Done</Link></div>)}
      </div>
    </Shell>
  );
}
