import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MtcLogo } from "@/components/MtcLogo";

export function AuthModal() {
  const { authOpen, setAuthOpen, browseGuest } = useStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (pw.length < 6) return setError("Password must be at least six characters.");
    if (typeof navigator !== "undefined" && !navigator.onLine) return setError("You're offline. Connect to the internet to sign in or create an account.");

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(), password: pw, options: { emailRedirectTo: window.location.origin },
        });
        if (authError) { setError(authError.message); return; }
        if (!data.session) setSent(true);
        else setAuthOpen(false);
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (authError) { setError(authError.message === "Invalid login credentials" ? "Email or password is incorrect." : authError.message); return; }
        toast.success("You're signed in.");
        setAuthOpen(false);
      }
    } catch {
      setError("We couldn't connect to the account service. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const social = async (provider: "google" | "lovable") => {
    setError("");
    if (typeof navigator !== "undefined" && !navigator.onLine) return setError("You're offline. Please connect before signing in.");
    setBusy(true);
    try {
      const response = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (response.error) setError(response.error.message);
    } catch {
      setError("Sign-in could not start. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={authOpen} onOpenChange={(next) => { setAuthOpen(next); if (!next) setError(""); }}>
      <DialogContent
        className="fixed bottom-0 left-1/2 top-auto flex max-h-[92dvh] w-full max-w-md -translate-x-1/2 translate-y-0 flex-col gap-0 overflow-y-auto rounded-b-none rounded-t-[28px] border-border bg-card px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-7 shadow-lg sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-[28px]"
      >
        <div className="mb-5 flex items-center gap-2">
          <MtcLogo className="size-14" />
          <span className="text-[13px] text-muted-foreground">Pocket Market</span>
        </div>

        <DialogTitle className="pr-6 text-[25px] font-bold leading-tight tracking-tight">
          {sent ? "Check your email" : mode === "signin" ? "Welcome back" : "Create your account"}
        </DialogTitle>
        <DialogDescription className="mt-2 text-[14px] leading-6">
          {sent ? `We sent a confirmation link to ${email.trim()}. Open it to complete sign-up.`
            : "Sign in to your Pocket Market account. This is not an MTC mobile-number login."}
        </DialogDescription>

        {sent ? (
          <Button type="button" onClick={() => { setSent(false); setMode("signin"); setPw(""); }}
            className="mt-6 h-13 w-full rounded-full text-[15px] font-semibold">Return to sign in</Button>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 rounded-[16px] bg-surface-2 p-1" role="group" aria-label="Account action">
              {(["signin", "signup"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={mode === option}
                  onClick={() => { setMode(option); setError(""); }}
                  className={`min-h-11 rounded-[13px] px-3 text-[14px] font-semibold ${mode === option ? "bg-card text-foreground" : "text-muted-foreground"}`}>
                  {option === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3">
              <div>
                <label htmlFor="pocket-email" className="mb-2 block text-[14px] font-semibold">Email address</label>
                <Input id="pocket-email" type="email" inputMode="email" autoComplete="email" required
                  value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }}
                  placeholder="you@example.com" className="h-13 rounded-[15px] bg-background px-4 text-[16px]" />
              </div>
              <div>
                <label htmlFor="pocket-password" className="mb-2 block text-[14px] font-semibold">Password</label>
                <Input id="pocket-password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6} required value={pw} onChange={(event) => { setPw(event.target.value); setError(""); }}
                  placeholder="At least six characters" className="h-13 rounded-[15px] bg-background px-4 text-[16px]" />
              </div>
              {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-[14px] leading-5 text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="h-13 w-full rounded-full text-[15px] font-semibold shadow-none">
                {busy ? "Connecting…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <div className="my-5 flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />Or use<span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => social("google")} disabled={busy}
                className="h-12 rounded-full text-[14px] font-semibold shadow-none">Google</Button>
              <Button type="button" variant="outline" onClick={() => social("lovable")} disabled={busy}
                className="h-12 rounded-full text-[14px] font-semibold shadow-none">Lovable</Button>
            </div>
            <p className="mt-5 text-center text-[12px] leading-5 text-muted-foreground">
              Account services and real MTC mobile numbers are not yet linked.
            </p>
          </>
        )}

        <Button type="button" variant="ghost" onClick={browseGuest}
          className="mt-4 h-12 w-full rounded-full text-[14px] font-semibold">Continue shopping as guest</Button>
      </DialogContent>
    </Dialog>
  );
}
