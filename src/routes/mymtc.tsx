import { createFileRoute, Link } from "@tanstack/react-router";
import { Wifi, Phone, FileText, QrCode, ShieldCheck, LogOut, Plus } from "lucide-react";
import { Shell } from "@/components/Shell";
import { bundles, nad } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/mymtc")({
  head: () => ({ meta: [{ title: "MyMTC — Account Dashboard" }, { name: "description", content: "Check your data balance and airtime, manage contracts and top up bundles." }, { property: "og:title", content: "MyMTC — Account Dashboard" }, { property: "og:description", content: "Check your data balance and airtime, manage contracts and top up bundles." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MyMTC,
});
function MyMTC() {
  const { user, add, setAuthOpen, logout, kycDone } = useStore();
  if (!user) return (
    <Shell><div className="px-5 pt-24 text-center"><h1 className="text-2xl font-bold">MyMTC</h1><p className="mt-2 text-muted-foreground">Sign in with your MTC number to see your balances and contracts.</p>
      <button onClick={() => setAuthOpen(true)} className="mt-6 h-14 w-full rounded-2xl bg-primary font-semibold text-primary-foreground">Sign in</button></div></Shell>
  );
  const used = 62;
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 pt-8">
        <div><p className="text-sm text-muted-foreground">+264 {user.phone}</p><h1 className="text-2xl font-bold">MyMTC</h1></div>
        <button aria-label="Sign out" onClick={logout} className="grid size-11 place-items-center rounded-full bg-card"><LogOut className="size-4" /></button>
      </header>
      <section className="mx-5 mt-6 rounded-[28px] bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="relative size-28 shrink-0 rounded-full" style={{ background: `conic-gradient(var(--mint) ${100 - used}%, var(--surface-2) 0)` }}>
            <div className="absolute inset-2 grid place-items-center rounded-full bg-card text-center"><div><p className="text-2xl font-extrabold">7.6</p><p className="text-[10px] text-muted-foreground">GB left</p></div></div>
          </div>
          <div className="space-y-3">
            <div><p className="text-xs text-muted-foreground">Data balance</p><p className="font-semibold">7.6 of 20 GB</p></div>
            <div><p className="text-xs text-muted-foreground">Airtime</p><p className="font-semibold">{nad(84.5)}</p></div>
            <div><p className="text-xs text-muted-foreground">Renews</p><p className="font-semibold">in 12 days</p></div>
          </div>
        </div>
      </section>
      <div className="mx-5 mt-4 grid grid-cols-4 gap-2">
        {[{ i: Wifi, l: "Bundles" }, { i: Phone, l: "Airtime" }, { i: QrCode, l: "eSIM", to: "/esim" }, { i: ShieldCheck, l: "Verify", to: "/kyc" }].map(({ i: I, l, to }) => {
          const inner = <><I className="size-5 text-mint" /><span className="text-[11px]">{l}</span></>;
          return to ? <Link key={l} to={to} className="flex flex-col items-center gap-2 rounded-[20px] bg-card py-4">{inner}</Link> : <div key={l} className="flex flex-col items-center gap-2 rounded-[20px] bg-card py-4">{inner}</div>;
        })}
      </div>
      <section className="px-5 pt-6">
        <h2 className="text-lg font-bold">Quick top-up</h2>
        <div className="mt-3 space-y-2">
          {bundles.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[20px] bg-card p-4">
              <div><p className="font-semibold">{b.name}</p><p className="text-xs text-muted-foreground">{b.data} · {b.validity}</p></div>
              <button onClick={() => add({ id: b.id, name: b.name, variant: b.id === "esim" ? "eSIM · QR delivery" : "Data bundle", price: b.price, kind: "digital" })}
                className="flex items-center gap-1 rounded-full bg-mint px-3 py-2 text-xs font-bold text-mint-foreground"><Plus className="size-3" />{nad(b.price)}</button>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 pt-6">
        <h2 className="text-lg font-bold">Active contracts</h2>
        <div className="mt-3 flex items-center gap-4 rounded-[20px] bg-card p-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary"><FileText className="size-5" /></div>
          <div className="flex-1"><p className="font-semibold">Aweh Super 24</p><p className="text-xs text-muted-foreground">Nova X 5G · 14 of 24 months</p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-2"><div className="h-full w-[58%] rounded-full bg-mint" /></div></div>
          <p className="text-sm font-bold">{nad(799)}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">VERIFI status: {kycDone ? <span className="text-mint">Verified</span> : "Not verified"}</p>
      </section>
    </Shell>
  );
}
