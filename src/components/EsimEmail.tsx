import { useEffect, useState } from "react";
import { Mail, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { validEmail } from "@/lib/checkout";

type Status = "idle" | "sending" | "sent" | "error";
/** Demo delivery: addresses containing "fail" or ending in .invalid simulate a bounce. */
const mockSend = (to: string) => new Promise<void>((res, rej) => setTimeout(() => (/fail|\.invalid$/i.test(to) ? rej(new Error("bounced")) : res()), 1200));

export function EsimEmail({ initial = "", autoSend = false }: { initial?: string; autoSend?: boolean }) {
  const [email, setEmail] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [cool, setCool] = useState(0);
  const send = async () => {
    setStatus("sending");
    try { await mockSend(email.trim()); setStatus("sent"); setSentAt(Date.now()); setCool(30); } catch { setStatus("error"); }
  };
  useEffect(() => { if (autoSend && validEmail(initial)) void send(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (cool <= 0) return; const t = setTimeout(() => setCool((c) => c - 1), 1000); return () => clearTimeout(t); }, [cool]);
  return (
    <div className="rounded-2xl bg-card p-4 text-left">
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-4" />Email the QR + activation code</p>
      {status === "sent" ? (
        <div role="status" className="mt-2">
          <p className="flex items-center gap-2 text-sm text-mint"><CheckCircle2 className="size-4" />Delivered to {email} at {new Date(sentAt!).toLocaleTimeString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Not in your inbox? Check spam, or resend.</p>
          <div className="mt-2 flex gap-3 text-sm">
            <button disabled={cool > 0} onClick={send} className="font-semibold text-mint disabled:text-muted-foreground">{cool > 0 ? `Resend in ${cool}s` : "Resend"}</button>
            <button onClick={() => setStatus("idle")} className="text-muted-foreground">Change email</button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-2 flex gap-2">
            <input type="email" aria-label="Email for eSIM" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} placeholder="you@example.com" className="h-10 flex-1 rounded-xl bg-surface-2 px-3 text-sm outline-none" />
            <button disabled={!validEmail(email) || status === "sending"} onClick={send} className="flex items-center gap-1 rounded-xl border px-4 text-sm font-semibold text-mint disabled:opacity-40">
              {status === "sending" ? <><Loader2 className="size-4 animate-spin" />Sending</> : status === "error" ? "Retry" : "Send"}</button>
          </div>
          {status === "error" && <p role="alert" className="mt-2 flex items-center gap-2 text-sm text-primary"><AlertTriangle className="size-4" />We couldn't deliver to {email}. Check the address and retry, or copy the code above.</p>}
        </>
      )}
    </div>
  );
}
