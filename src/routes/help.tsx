import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [
    { title: "Help and support — MTC Pocket Market" },
    { name: "description", content: "Answers about browsing, contract estimates, collection, demo checkout and account services." },
    { property: "og:title", content: "Help and support" },
    { property: "og:description", content: "Answers about MTC Pocket Market shopping, contract estimates and account services." },
    { name: "twitter:card", content: "summary" },
    { property: "og:type", content: "website" },
  ] }),
  component: Help,
});

const faqs = [
  { q: "Can I shop without signing in?", a: "Yes. You can browse products, compare devices and explore contract estimates as a guest." },
  { q: "Are contract quotes official?", a: "Not yet. Pocket Market displays illustrative contract estimates. Financing, eligibility and fees must be confirmed by MTC before applying." },
  { q: "Can I apply for a contract here?", a: "This concept demonstrates the shopping journey only. Actual contract applications require authorised MTC identity and application services." },
  { q: "Can I reserve a device for collection?", a: "You can explore location names, but live stock and reservations are not connected yet. Confirm availability with MTC before visiting." },
  { q: "Does the checkout charge my card?", a: "No. Checkout currently saves only a local demo order. It does not process a payment, reserve stock or trigger a delivery." },
  { q: "Is My MTC connected to my phone number?", a: "Not yet. Pocket Market sign-in is separate from your MTC mobile account. Balances and active contracts shown in the concept are examples." },
  { q: "Can I buy airtime or activate an eSIM?", a: "Those interactions are demonstrations until an authorised purchase or provisioning integration is available." },
  { q: "How do I contact MTC?", a: "Use MTC's official website or a verified MTC branch for service, product availability and current support contact details." },
];

function Help() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const results = faqs.filter((f) => (f.q + " " + f.a).toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Shell>
      <div className="px-5 pt-6 pb-10">
        <Link to="/settings" aria-label="Back to Account" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <div className="mt-7 grid size-14 place-items-center rounded-[18px] bg-card"><HelpCircle className="size-7 text-mint" /></div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">How can we help?</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Answers about the Pocket Market concept and what's available in this release.</p>
        <label className="mt-6 flex h-14 items-center gap-3 rounded-full bg-card px-5">
          <Search className="size-5 text-mint" />
          <input aria-label="Search help topics" placeholder="Search help topics" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="mt-5 space-y-2">
          {results.map((faq) => {
            const index = faqs.indexOf(faq);
            return <div key={faq.q} className="rounded-[20px] bg-card shadow-card">
              <button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold">
                {faq.q}<span className="shrink-0 text-mint">{open === index ? "−" : "+"}</span>
              </button>
              {open === index && <p className="px-4 pb-4 text-sm leading-6 text-muted-foreground">{faq.a}</p>}
            </div>;
          })}
          {results.length === 0 && <p className="rounded-2xl bg-card p-6 text-sm text-muted-foreground">No matching help topics.</p>}
        </div>
        <a href="https://www.mtc.com.na" target="_blank" rel="noreferrer" className="mt-7 flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground">Official MTC website <ArrowUpRight className="size-4" /></a>
      </div>
    </Shell>
  );
}
