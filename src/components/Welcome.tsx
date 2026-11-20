import { useEffect, useState } from "react";
import { Smartphone, Gauge, QrCode } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const slides = [
  { i: Smartphone, t: "Shop the latest devices", d: "Phones, laptops and audio — pay cash or spread it on contract." },
  { i: Gauge, t: "Manage MyMTC", d: "Balances, bundles, contracts and orders in one place." },
  { i: QrCode, t: "eSIM in minutes", d: "Buy a plan, scan a QR code, and you're connected." },
];
export function Welcome() {
  const { extra, setExtra, setAuthOpen, user, guest } = useStore();
  const [splash, setSplash] = useState(true);
  const [i, setI] = useState(0);
  useEffect(() => { const t = setTimeout(() => setSplash(false), 1400); return () => clearTimeout(t); }, []);
  if (extra.onboarded || user || guest) return null;
  const finish = () => { setExtra((e) => ({ ...e, onboarded: true })); setAuthOpen(true); };
  if (splash) return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background">
      <div className="text-center animate-in zoom-in-50 fade-in duration-700">
        <div className="mx-auto grid size-24 place-items-center rounded-[28px] bg-primary text-4xl font-black italic lowercase tracking-tight text-primary-foreground">mtc</div>
        <p className="mt-4 text-sm italic text-muted-foreground">make the connection</p>
      </div>
    </div>
  );
  const S = slides[i]!;
  return (
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-md flex-col bg-background px-6 pb-10 pt-16">
      <button onClick={finish} className="self-end text-sm text-muted-foreground">Skip</button>
      <div key={i} className="flex flex-1 flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-8">
        <div className="grid size-40 place-items-center rounded-full bg-mint/10 glow-mint"><S.i className="size-16 text-mint" /></div>
        <h1 className="mt-10 text-3xl font-extrabold">{S.t}</h1>
        <p className="mt-3 text-muted-foreground">{S.d}</p>
      </div>
      <div className="mb-6 flex justify-center gap-2">{slides.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-8 bg-mint" : "w-1.5 bg-surface-2")} />)}</div>
      <button onClick={() => (i < 2 ? setI(i + 1) : finish())} className="h-14 rounded-full bg-primary font-semibold text-primary-foreground">{i < 2 ? "Next" : "Get started"}</button>
    </div>
  );
}
