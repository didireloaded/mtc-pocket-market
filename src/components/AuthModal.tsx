import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const { authOpen, setAuthOpen, login, browseGuest, guest } = useStore();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "sending">("input");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  if (!authOpen) return null;
  const sendOtp = () => { setStep("sending"); setTimeout(() => setStep("otp"), 900); };
  const verify = () => otp === "0000" ? setErr("That code is incorrect. Try again.") : login({ label: "+264 " + phone, method: "phone" });
  const emailIn = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    if (pw.length < 6) return setErr("Password must be at least 6 characters.");
    login({ label: email, method: "email" });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-t-[32px] border bg-card p-6 pb-10 animate-in slide-in-from-bottom">
        {guest && <button aria-label="Close" onClick={() => setAuthOpen(false)} className="absolute right-5 top-5 text-muted-foreground"><X className="size-5" /></button>}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-surface-2" />
        <div className="flex items-center gap-2"><span className="rounded-md bg-primary px-2 py-0.5 text-sm font-black italic lowercase text-primary-foreground">mtc</span><span className="text-xs text-muted-foreground">Namibia</span></div>
        <h2 className="mt-3 text-2xl font-bold">{step === "otp" ? "Enter code" : "Sign in to MTC Store"}</h2>
        {step !== "otp" && (
          <div className="mt-4 grid grid-cols-2 rounded-full bg-surface-2 p-1 text-sm font-semibold">
            {(["phone", "email"] as const).map((m) => <button key={m} onClick={() => { setMethod(m); setErr(""); }} className={cn("rounded-full py-2", method === m ? "bg-mint text-mint-foreground" : "text-muted-foreground")}>{m === "phone" ? "Phone" : "Email"}</button>)}
          </div>
        )}
        {method === "phone" ? (step !== "otp" ? (<>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-2 px-4">
            <span className="text-sm text-muted-foreground">+264</span>
            <input aria-label="Phone number" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="81 234 5678" className="h-14 flex-1 bg-transparent outline-none" />
          </div>
          <button disabled={phone.length < 8 || step === "sending"} onClick={sendOtp} className="mt-4 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40">{step === "sending" ? "Sending code…" : "Send OTP"}</button>
        </>) : (<>
          <p className="mt-1 text-sm text-muted-foreground">We sent a 4-digit code to +264 {phone}. Demo: any code except 0000.</p>
          <input aria-label="One-time code" autoFocus inputMode="numeric" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)); setErr(""); }} placeholder="• • • •" className="mt-5 h-16 w-full rounded-2xl bg-surface-2 text-center text-3xl tracking-[0.6em] outline-none" />
          <button disabled={otp.length < 4} onClick={verify} className="mt-4 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40">Verify & continue</button>
          <div className="mt-2 flex justify-between text-sm text-muted-foreground"><button onClick={() => { setStep("input"); setOtp(""); }}>Change number</button><button onClick={sendOtp} className="text-mint">Resend code</button></div>
        </>)) : (<>
          <input aria-label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="you@example.com" className="mt-4 h-14 w-full rounded-full bg-surface-2 px-4 outline-none" />
          <input aria-label="Password" type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder="Password" className="mt-2 h-14 w-full rounded-full bg-surface-2 px-4 outline-none" />
          <button onClick={emailIn} className="mt-4 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground">Sign in</button>
        </>)}
        {err && <p role="alert" className="mt-3 text-sm text-primary">{err}</p>}
        <button onClick={browseGuest} className="mt-4 h-12 w-full rounded-2xl border text-sm font-medium text-mint">Browse as Guest</button>
      </div>
    </div>
  );
}
