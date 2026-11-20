import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Fingerprint, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Profile & Settings — MTC Store" }, { name: "description", content: "Manage your details, addresses, linked MTC numbers, notifications and app lock." }, { property: "og:title", content: "Profile & Settings — MTC Store" }, { property: "og:description", content: "Manage your MTC Store profile and preferences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Settings,
});
function Toggle({ on, onChange, label }: { on: boolean; onChange: (b: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={"relative h-6 w-11 rounded-full transition " + (on ? "bg-mint" : "bg-surface-2")}><span className={"absolute top-0.5 size-5 rounded-full bg-card shadow transition-all " + (on ? "left-[22px]" : "left-0.5")} /></button>;
}
function Settings() {
  const { user, extra, setExtra, setAuthOpen } = useStore();
  const [num, setNum] = useState(""); const [lbl, setLbl] = useState("");
  const prefs = [["orders", "Order updates"], ["priceDrops", "Price drops on saved items"], ["lowBalance", "Low balance warnings"]] as const;
  return (
    <Shell>
      <div className="space-y-4 px-5 pt-6">
        <Link to="/mymtc" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="text-3xl font-bold">Profile & settings</h1>
        <section className="rounded-[20px] bg-card shadow-card p-4 text-sm"><p className="text-xs text-muted-foreground">Signed in as</p>
          {user ? <p className="mt-1 font-semibold">{user.label}</p> : <button onClick={() => setAuthOpen(true)} className="mt-1 font-semibold text-mint">Guest — sign in</button>}</section>
        <section className="rounded-[20px] bg-card shadow-card p-4 text-sm"><p className="mb-2 font-semibold">Saved addresses</p>
          {extra.addresses.map((a) => <div key={a.label} className="flex items-center justify-between border-t py-2 first:border-t-0"><div><p className="font-medium">{a.label}</p><p className="text-xs text-muted-foreground">{a.street}, {a.town}</p></div>
            <button aria-label={`Remove ${a.label}`} onClick={() => setExtra((e) => ({ ...e, addresses: e.addresses.filter((x) => x.label !== a.label) }))}><Trash2 className="size-4 text-muted-foreground" /></button></div>)}
          <p className="mt-1 text-xs text-muted-foreground">Add addresses from the bag at checkout.</p></section>
        <section className="rounded-[20px] bg-card shadow-card p-4 text-sm"><p className="mb-2 font-semibold">Linked MTC numbers</p>
          {extra.numbers.map((n) => <div key={n.number} className="flex items-center justify-between border-t py-2 first:border-t-0"><div><p className="font-medium">{n.label}</p><p className="text-xs text-muted-foreground">+264 {n.number}</p></div>
            <button aria-label={`Remove ${n.label}`} onClick={() => setExtra((e) => ({ ...e, numbers: e.numbers.filter((x) => x.number !== n.number) }))}><Trash2 className="size-4 text-muted-foreground" /></button></div>)}
          <div className="mt-2 flex gap-2"><input value={lbl} onChange={(e) => setLbl(e.target.value)} placeholder="Name (e.g. Mum)" className="h-10 w-28 rounded-xl bg-surface-2 px-3 text-xs outline-none" /><input inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="81 234 5678" className="h-10 flex-1 rounded-xl bg-surface-2 px-3 text-xs outline-none" />
            <button aria-label="Add number" disabled={num.length < 8 || !lbl.trim()} onClick={() => { setExtra((e) => ({ ...e, numbers: [...e.numbers, { number: num, label: lbl.trim() }] })); setNum(""); setLbl(""); }} className="grid size-10 place-items-center rounded-xl bg-mint text-mint-foreground disabled:opacity-40"><Plus className="size-4" /></button></div></section>
        <section className="space-y-3 rounded-[20px] bg-card shadow-card p-4 text-sm"><p className="font-semibold">Notifications</p>
          {prefs.map(([k, l]) => <div key={k} className="flex items-center justify-between"><span>{l}</span><Toggle label={l} on={extra.prefs[k]} onChange={(b) => setExtra((e) => ({ ...e, prefs: { ...e.prefs, [k]: b } }))} /></div>)}</section>
        <section className="flex items-center justify-between rounded-[20px] bg-card shadow-card p-4 text-sm"><span className="flex items-center gap-2"><Fingerprint className="size-5 text-mint" />Face ID / fingerprint lock</span><Toggle label="Biometric lock" on={extra.biometric} onChange={(b) => setExtra((e) => ({ ...e, biometric: b }))} /></section>
      </div>
    </Shell>
  );
}
