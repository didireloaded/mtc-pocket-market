import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const { authOpen, setAuthOpen, browseGuest, guest } = useStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  if (!authOpen) return null;

  const submit = async () => {
    setErr("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    if (pw.length < 6) return setErr("Password must be at least 6 characters.");
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin } });
      setBusy(false);
      if (error) return setErr(error.message);
      if (!data.session) setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) return setErr(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
      toast.success("Welcome back!");
    }
  };
  const social = async (p: "google" | "lovable") => {
    setErr("");
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) setErr(r.error.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-t-[32px] border bg-card p-6 pb-10 animate-in slide-in-from-bottom">
        {guest && <button aria-label="Close" onClick={() => setAuthOpen(false)} className="absolute right-5 top-5 text-muted-foreground"><X className="size-5" /></button>}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-surface-2" />
        <div className="flex items-center gap-2"><span className="rounded-md bg-primary px-2 py-0.5 text-sm font-black italic lowercase text-primary-foreground">mtc</span><span className="text-xs text-muted-foreground">Namibia</span></div>
        {sent ? (<>
          <h2 className="mt-3 text-2xl font-bold">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">We sent a confirmation link to {email}. Open it to finish creating your account.</p>
          <button onClick={() => { setSent(false); setMode("signin"); }} className="mt-5 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground">Back to sign in</button>
        </>) : (<>
          <h2 className="mt-3 text-2xl font-bold">{mode === "signin" ? "Sign in to MTC Store" : "Create your account"}</h2>
          <div className="mt-4 grid grid-cols-2 rounded-full bg-surface-2 p-1 text-sm font-semibold">
            {(["signin", "signup"] as const).map((m) => <button key={m} onClick={() => { setMode(m); setErr(""); }} className={cn("rounded-full py-2", mode === m ? "bg-mint text-mint-foreground" : "text-muted-foreground")}>{m === "signin" ? "Sign in" : "Sign up"}</button>)}
          </div>
          <input aria-label="Email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="you@example.com" className="mt-4 h-14 w-full rounded-full bg-surface-2 px-4 outline-none" />
          <input aria-label="Password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder="Password" className="mt-2 h-14 w-full rounded-full bg-surface-2 px-4 outline-none" />
          <button disabled={busy} onClick={submit} className="mt-4 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => social("google")} className="h-12 rounded-full border text-sm font-semibold">Google</button>
            <button onClick={() => social("lovable")} className="h-12 rounded-full border text-sm font-semibold">Lovable</button>
          </div>
        </>)}
        {err && <p role="alert" className="mt-3 text-sm text-destructive">{err}</p>}
        <button onClick={browseGuest} className="mt-4 h-12 w-full rounded-2xl border text-sm font-medium text-mint">Browse as Guest</button>
      </div>
    </div>
  );
}
