import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as Cog, LifeBuoy, Smartphone, Package, MapPin, FileText, QrCode, ShieldCheck, LogOut, Plus } from "lucide-react";
import { Shell } from "@/components/Shell";
import { bundles, nad } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/mymtc")({
  head: () => ({ meta: [{ title: "MyMTC — Account Dashboard" }, { name: "description", content: "Check your data balance and airtime, manage contracts and top up bundles." }, { property: "og:title", content: "MyMTC — Account Dashboard" }, { property: "og:description", content: "Check your data balance and airtime, manage contracts and top up bundles." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MyMTC,
});
function MyMTC() {
  const { user, add, setAuthOpen, logout, extra, orders } = useStore();
  const kycSteps = ["Submitted", "Under review", "Approved"] as const;
  const kycIdx = extra.kyc === "approved" ? 2 : extra.kyc === "pending" ? 1 : -1;
  const usage = [1.2, 0.8, 2.1, 1.6, 0.9, 2.4, 1.3, 0.6, 1.8, 2.2, 1.1, 0.7];
  const devices = orders.flatMap((o) => o.items.filter((i) => i.kind === "physical").map((i, k) => ({ name: i.name, imei: "35" + o.id.slice(3) + String(k).padStart(6, "0"), warrantyTo: new Date(o.placedAt + 365 * 864e5).toLocaleDateString() })));
  if (!user) return (
    <Shell><div className="px-5 pt-24 text-center"><h1 className="text-2xl font-bold">MyMTC</h1><p className="mt-2 text-muted-foreground">You're browsing as a guest. Sign in to see your balances, contracts and orders.</p>
      <button onClick={() => setAuthOpen(true)} className="mt-6 h-14 w-full rounded-full bg-primary font-semibold text-primary-foreground">Sign in</button><Link to="/stores" className="mt-3 block text-sm text-mint">Find an MTC store</Link></div></Shell>
  );
  const used = 62;
  return (
    <Shell>
      <header className="flex items-center justify-between px-5 pt-8">
        <div><p className="text-sm text-muted-foreground">{user.label} · {user.method === "phone" ? "OTP" : "Email"} sign-in</p><h1 className="text-2xl font-bold">MyMTC</h1></div>
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
        {[{ i: Package, l: "Orders", to: "/orders" as const }, { i: MapPin, l: "Stores", to: "/stores" as const }, { i: QrCode, l: "eSIM", to: "/esim" as const }, { i: ShieldCheck, l: "Verify", to: "/kyc" as const }].map(({ i: I, l, to }) => {
          const inner = <><I className="size-5 text-mint" /><span className="text-[11px]">{l}</span></>;
          return <Link key={l} to={to} className="flex flex-col items-center gap-2 rounded-[20px] bg-card shadow-card py-4">{inner}</Link>;
        })}
      </div>
      <section className="px-5 pt-6">
        <h2 className="text-lg font-bold">Quick top-up</h2>
        <div className="mt-3 space-y-2">
          {bundles.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[20px] bg-card shadow-card p-4">
              <div><p className="font-semibold">{b.name}</p><p className="text-xs text-muted-foreground">{b.data} · {b.validity}</p></div>
              <button onClick={() => add({ id: b.id, name: b.name, variant: b.id === "esim" ? "eSIM · QR delivery" : "Data bundle", price: b.price, kind: "digital" })}
                className="flex items-center gap-1 rounded-full bg-mint px-3 py-2 text-xs font-bold text-mint-foreground"><Plus className="size-3" />{nad(b.price)}</button>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 pt-6">
        <h2 className="text-lg font-bold">Active contracts</h2>
        <div className="mt-3 flex items-center gap-4 rounded-[20px] bg-card shadow-card p-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary"><FileText className="size-5" /></div>
          <div className="flex-1"><p className="font-semibold">Select Up</p><p className="text-xs text-muted-foreground">Samsung Galaxy S26 256GB · 14 of 24 months</p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-2"><div className="h-full w-[58%] rounded-full bg-mint" /></div></div>
          <p className="text-sm font-bold">{nad(1260.24)}</p>
        </div>
        </section>
      <section className="px-5 pt-6"><h2 className="text-lg font-bold">Data used · last 12 days</h2>
        <div className="mt-3 flex h-28 items-end gap-1.5 rounded-[20px] bg-card shadow-card p-4">{usage.map((u, i) => <div key={i} className="flex-1 rounded-t bg-mint/80" style={{ height: `${(u / 2.4) * 100}%` }} title={`${u} GB`} />)}</div>
        <p className="mt-1 text-xs text-muted-foreground">Voice: 142 min · SMS: 38 this cycle</p>
      </section>
      <section className="px-5 pt-6"><h2 className="text-lg font-bold">VERIFI identity</h2>
        <div className="mt-3 rounded-[20px] bg-card shadow-card p-4">
          {kycIdx < 0 ? <Link to="/kyc" className="text-sm text-mint">Not verified — start ID check →</Link> : (
            <ol className="flex">{kycSteps.map((st, i) => <li key={st} className="flex flex-1 flex-col items-center text-center"><span className={"size-3 rounded-full " + (i <= kycIdx ? "bg-mint" : "bg-surface-2")} /><span className={"mt-1 text-[11px] " + (i === kycIdx ? "font-semibold text-mint" : "text-muted-foreground")}>{st}</span></li>)}</ol>)}
          {extra.kyc === "rejected" && <p className="mt-2 text-sm text-brand-red">Rejected — please retry with a clearer photo.</p>}
        </div>
      </section>
      <section className="px-5 pt-6"><h2 className="text-lg font-bold">My devices</h2>
        {devices.length ? <div className="mt-3 space-y-2">{devices.map((d) => <div key={d.imei} className="flex items-center gap-3 rounded-[20px] bg-card shadow-card p-4"><Smartphone className="size-5 text-mint" /><div className="flex-1"><p className="text-sm font-semibold">{d.name}</p><p className="font-mono text-[11px] text-muted-foreground">IMEI {d.imei}</p></div><p className="text-[11px] text-muted-foreground">Warranty to {d.warrantyTo}</p></div>)}</div>
          : <p className="mt-2 text-sm text-muted-foreground">Devices you buy will show here with IMEI and warranty.</p>}
      </section>
      <section className="grid grid-cols-2 gap-2 px-5 pt-6">
        <Link to="/settings" className="flex items-center gap-2 rounded-[20px] bg-card shadow-card p-4 text-sm font-semibold"><Cog className="size-5 text-mint" />Profile & settings</Link>
        <Link to="/help" className="flex items-center gap-2 rounded-[20px] bg-card shadow-card p-4 text-sm font-semibold"><LifeBuoy className="size-5 text-mint" />Help & support</Link>
      </section>
    </Shell>
  );
}
