import { useState } from "react";
import { useStore } from "@/lib/store";

export function AuthModal() {
  const { authOpen, login, browseGuest } = useStore();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  if (!authOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-t-[32px] border bg-card p-6 pb-10 animate-in slide-in-from-bottom">
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-surface-2" />
        <div className="mb-1 flex items-center gap-2"><span className="rounded-md bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">MTC</span><span className="text-xs text-muted-foreground">Namibia</span></div>
        {step === "phone" ? (<>
          <h2 className="mt-3 text-2xl font-bold">Welcome to MTC Store</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your MTC number to manage bundles, contracts and orders.</p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-surface-2 px-4">
            <span className="text-sm text-muted-foreground">+264</span>
            <input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="81 234 5678" className="h-14 flex-1 bg-transparent outline-none" />
          </div>
          <button disabled={phone.length < 8} onClick={() => setStep("otp")} className="mt-4 h-14 w-full rounded-2xl bg-primary font-semibold text-primary-foreground disabled:opacity-40 glow-red">Send OTP</button>
        </>) : (<>
          <h2 className="mt-3 text-2xl font-bold">Enter code</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sent to +264 {phone}. Demo: any 4 digits.</p>
          <input autoFocus inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="• • • •" className="mt-6 h-16 w-full rounded-2xl bg-surface-2 text-center text-3xl tracking-[0.6em] outline-none" />
          <button disabled={otp.length < 4} onClick={() => login(phone)} className="mt-4 h-14 w-full rounded-2xl bg-primary font-semibold text-primary-foreground disabled:opacity-40 glow-red">Verify & continue</button>
          <button onClick={() => setStep("phone")} className="mt-2 w-full text-sm text-muted-foreground">Change number</button>
        </>)}
        <button onClick={browseGuest} className="mt-4 h-12 w-full rounded-2xl border text-sm font-medium text-mint">Browse as Guest</button>
      </div>
    </div>
  );
}
