import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, MessageCircle, Phone, Star, Signal } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support — MTC Store" }, { name: "description", content: "Answers about eSIM, contracts, orders and payments, plus WhatsApp support and coverage." }, { property: "og:title", content: "Help & Support — MTC Store" }, { property: "og:description", content: "Answers, WhatsApp support and coverage for MTC customers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Help,
});
const faqs = [
  { q: "How do I activate my eSIM?", a: "After payment, open eSIM activation, scan the QR code from another screen, or copy the activation code on this phone: Settings → Mobile/SIMs → Add eSIM." },
  { q: "Can I buy a laptop on contract?", a: "Yes. Laptops are available on Select Shared SIM plans (plus Mobiz/SmartShare Shared SIM and capped data plans in store) over 12, 24 or 36 months." },
  { q: "Which plans allow 48 months?", a: "The 48-month option is only available on Supreme, Infinite and Mobiz Sky plans." },
  { q: "What do I need for a contract?", a: "A valid Namibian ID or passport and a selfie for VERIFI identity checks. Approval usually takes minutes." },
  { q: "When will my order arrive?", a: "Shipped devices arrive in 1–3 business days. You'll get a notification when it ships and when it's out for delivery." },
  { q: "How do I reset my password?", a: "Choose Email on the sign-in screen and use 'Forgot password', or sign in with your MTC number and a one-time code." },
];
/** Demo coverage lookup by town. */
const coverage: Record<string, string> = { windhoek: "5G", swakopmund: "5G", "walvis bay": "5G", oshakati: "5G", ongwediva: "4G", rundu: "4G", keetmanshoop: "4G", otjiwarongo: "4G", "katima mulilo": "4G", opuwo: "4G" };
function Help() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [town, setTown] = useState("");
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  const list = faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));
  const cov = town.trim() ? coverage[town.trim().toLowerCase()] ?? "3G/4G — check with your nearest store" : null;
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/mymtc" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="mt-5 text-3xl font-bold">Help & support</h1>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href="https://wa.me/264811000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-[20px] bg-card p-4 text-sm font-semibold"><MessageCircle className="size-5 text-mint" />WhatsApp chat</a>
          <a href="tel:+264612802000" className="flex items-center gap-2 rounded-[20px] bg-card p-4 text-sm font-semibold"><Phone className="size-5 text-mint" />Call MTC</a>
        </div>
        <label className="mt-5 flex items-center gap-3 rounded-2xl bg-card px-4"><Search className="size-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help" className="h-12 flex-1 bg-transparent text-sm outline-none" /></label>
        <div className="mt-3 space-y-2">{list.map((f, i) => (
          <div key={f.q} className="rounded-[20px] bg-card p-4"><button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left text-sm font-semibold">{f.q}</button>{open === i && <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>}</div>))}
          {!list.length && <p className="py-6 text-center text-sm text-muted-foreground">No answers found. Try WhatsApp chat.</p>}</div>
        <section className="mt-6 rounded-[20px] bg-card p-4"><p className="flex items-center gap-2 text-sm font-semibold"><Signal className="size-4 text-mint" />Check network coverage</p>
          <input value={town} onChange={(e) => setTown(e.target.value)} placeholder="Enter your town" className="mt-2 h-11 w-full rounded-xl bg-surface-2 px-3 text-sm outline-none" />
          {cov && <p className="mt-2 text-sm">Best available: <span className="font-semibold text-mint">{cov}</span></p>}</section>
        <section className="mt-4 rounded-[20px] bg-card p-4"><p className="text-sm font-semibold">Rate the app</p>
          {sent ? <p className="mt-2 text-sm text-mint">Thanks for your feedback!</p> : <>
            <div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} aria-label={`${n} stars`} onClick={() => setRating(n)}><Star className={"size-7 " + (n <= rating ? "fill-current text-warning" : "text-muted-foreground")} /></button>)}</div>
            <button disabled={!rating} onClick={() => setSent(true)} className="mt-3 h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40">Send feedback</button></>}
        </section>
      </div>
    </Shell>
  );
}
