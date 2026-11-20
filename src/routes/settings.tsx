import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, ChevronDown, Heart, MapPin, Package, Plus, ShoppingBag, Trash2, UserRound, ShieldCheck, LifeBuoy, LogOut } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { getProduct, nad } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Profile — MTC Pocket Market" },
    { name: "description", content: "Your saved devices, account, addresses and preferences in Pocket Market." },
    { property: "og:title", content: "Profile — MTC Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: Profile,
});

const preferenceLabels = [
  ["orders", "Order request updates"],
  ["priceDrops", "Saved product price updates"],
  ["lowBalance", "MTC account balance alerts"],
] as const;

function PreferenceSwitch({ on, onChange, label }: { on: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={on}
    onClick={() => onChange(!on)}
    className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
      on ? "bg-[#202E39]" : "bg-[#DDE1E4]")}>
    <span className={cn("absolute top-[3px] size-[22px] rounded-full bg-white shadow-sm transition-all",
      on ? "left-[23px]" : "left-[3px]")} />
  </button>;
}

function Profile() {
  const { user, setAuthOpen, logout, cart, orders, saved, extra, setExtra } = useStore();
  const [number, setNumber] = useState("");
  const [numberLabel, setNumberLabel] = useState("");
  const savedProducts = saved.map(getProduct).filter((product) => Boolean(product));
  const itemsCount = cart.reduce((count, item) => count + item.qty, 0);
  const firstName = user?.displayName?.trim().split(/\s+/)[0] || null;
  const initials = user?.displayName?.trim().slice(0, 1).toUpperCase() || (user ? "M" : "G");

  return (
    <Shell>
      <div className="pb-10 pt-[max(28px,env(safe-area-inset-top))]">
        <header className="px-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.11em] text-primary">POCKET MARKET</p>
          <h1 className="mt-1 text-[34px] font-bold tracking-[-0.055em]">Profile</h1>
        </header>

        <section aria-label="Your account" className="mx-5 mt-6 overflow-hidden rounded-[29px] bg-[#202E39] px-6 py-7 text-white">
          <div className="flex items-center gap-4">
            <div className="grid size-[66px] shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-[25px] font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-white/65">{user ? "Your Pocket Market account" : "Browsing as a guest"}</p>
              <h2 className="mt-1 truncate text-[24px] font-bold tracking-[-0.04em]">{firstName ? `Hi, ${firstName}.` : "Your space."}</h2>
              <p className="mt-1 truncate text-[13px] text-white/75">{user?.label ?? "Discover, save and shop at your pace."}</p>
            </div>
          </div>
          {!user ? <button type="button" onClick={() => setAuthOpen(true)}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-[#202E39]">
            Sign in or create an account <ArrowRight aria-hidden="true" className="size-4" />
          </button> : <button type="button" onClick={logout}
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-white/85">
            <LogOut aria-hidden="true" className="size-[17px]" /> Sign out
          </button>}
        </section>

        <section aria-label="Quick links" className="mt-8 grid grid-cols-2 gap-3 px-5">
          <Link to="/cart" className="flex min-h-[118px] flex-col justify-between rounded-[22px] bg-white p-5">
            <ShoppingBag aria-hidden="true" className="size-[23px] text-primary" strokeWidth={1.9} />
            <span>
              <span className="block text-[16px] font-semibold">My cart</span>
              <span className="mt-1 block text-[12px] text-muted-foreground">{itemsCount} item{itemsCount === 1 ? "" : "s"}</span>
            </span>
          </Link>
          <Link to="/orders" className="flex min-h-[118px] flex-col justify-between rounded-[22px] bg-white p-5">
            <Package aria-hidden="true" className="size-[23px] text-primary" strokeWidth={1.9} />
            <span>
              <span className="block text-[16px] font-semibold">Orders</span>
              <span className="mt-1 block text-[12px] text-muted-foreground">{orders.length} local preview{orders.length === 1 ? "" : "s"}</span>
            </span>
          </Link>
        </section>

        <section aria-labelledby="profile-saved" className="mt-10">
          <div className="flex items-center justify-between gap-3 px-6">
            <div>
              <h2 id="profile-saved" className="text-[21px] font-bold tracking-[-0.04em]">Saved devices</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{saved.length ? `${saved.length} bookmarked` : "Keep the devices you love close."}</p>
            </div>
            <Heart aria-hidden="true" className="size-[21px] text-primary" />
          </div>
          {savedProducts.length > 0 ? <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-6 pb-2">
            {savedProducts.map((product) => product && <Link to="/product/$id" params={{ id: product.id }} key={product.id}
              className="w-[143px] shrink-0 snap-start rounded-[21px] bg-white p-3">
              <div className="grid aspect-square place-items-center rounded-[15px] bg-stage p-2">
                <img src={product.image} alt={product.name} loading="lazy" className="size-full object-contain" />
              </div>
              <p className="mt-3 line-clamp-2 min-h-[38px] text-[13px] font-semibold leading-[19px]">{product.name}</p>
              <p className="mt-2 text-[15px] font-bold tabular-nums">{nad(product.cash)}</p>
            </Link>)}
          </div> : <Link to="/shop" className="mx-5 mt-4 flex min-h-[68px] items-center justify-between gap-3 rounded-[19px] bg-white px-5 text-[14px] font-semibold">
            Explore devices <ArrowRight aria-hidden="true" className="size-[18px]" />
          </Link>}
        </section>

        <section aria-labelledby="profile-more" className="mt-10 px-5">
          <h2 id="profile-more" className="px-1 text-[21px] font-bold tracking-[-0.04em]">Your details</h2>
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-[23px] bg-white">
            <details className="group">
              <summary className="flex min-h-[73px] cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
                <MapPin aria-hidden="true" className="size-[20px] text-mint" />
                <span className="flex-1 text-[14px] font-semibold">Saved addresses</span>
                <span className="text-[12px] text-muted-foreground">{extra.addresses.filter((a) => a.street).length}</span>
                <ChevronDown aria-hidden="true" className="size-[18px] text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-2 px-5 pb-5">
                {extra.addresses.filter((a) => a.street).length ? extra.addresses.filter((a) => a.street).map((address) => <div key={address.label} className="flex items-start gap-3 rounded-[15px] bg-[#F4F5F7] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{address.label}</p>
                    <p className="mt-1 text-[12px] leading-5 text-muted-foreground">{address.street}, {address.town}{address.region ? `, ${address.region}` : ""}</p>
                  </div>
                  <button type="button" aria-label={`Remove ${address.label}`} onClick={() => setExtra((current) => ({ ...current, addresses: current.addresses.filter((item) => item.label !== address.label) }))}
                    className="grid size-11 shrink-0 place-items-center rounded-full">
                    <Trash2 aria-hidden="true" className="size-[18px] text-muted-foreground" />
                  </button>
                </div>) : <p className="text-[13px] leading-5 text-muted-foreground">Save an address while preparing a cart request.</p>}
              </div>
            </details>

            <details className="group">
              <summary className="flex min-h-[73px] cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
                <UserRound aria-hidden="true" className="size-[20px] text-mint" />
                <span className="flex-1 text-[14px] font-semibold">Saved numbers</span>
                <span className="text-[12px] text-muted-foreground">{extra.numbers.length}</span>
                <ChevronDown aria-hidden="true" className="size-[18px] text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">
                <p className="mb-4 text-[12px] leading-5 text-muted-foreground">Stored on this device for convenience. Not linked to an MTC account.</p>
                {extra.numbers.map((contact) => <div key={contact.number} className="flex items-center gap-2 border-b border-border py-3">
                  <span className="flex-1">
                    <span className="block text-[14px] font-semibold">{contact.label}</span>
                    <span className="block text-[12px] text-muted-foreground">+264 {contact.number}</span>
                  </span>
                  <button type="button" aria-label={`Remove ${contact.label}`} onClick={() => setExtra((current) => ({ ...current, numbers: current.numbers.filter((item) => item.number !== contact.number) }))}
                    className="grid size-11 place-items-center rounded-full"><Trash2 aria-hidden="true" className="size-5 text-muted-foreground" /></button>
                </div>)}
                <div className="mt-4 grid grid-cols-[1fr_1fr_44px] gap-2">
                  <input aria-label="Saved number name" value={numberLabel} onChange={(event) => setNumberLabel(event.target.value)} placeholder="Name"
                    className="h-11 min-w-0 rounded-[12px] bg-[#F4F5F7] px-3 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-mint" />
                  <input aria-label="Saved mobile number" inputMode="numeric" value={number}
                    onChange={(event) => setNumber(event.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="81…"
                    className="h-11 min-w-0 rounded-[12px] bg-[#F4F5F7] px-3 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-mint" />
                  <button type="button" aria-label="Save number" disabled={number.length < 8 || !numberLabel.trim()}
                    onClick={() => { setExtra((current) => ({ ...current, numbers: [...current.numbers.filter((item) => item.number !== number), { number, label: numberLabel.trim() }] })); setNumber(""); setNumberLabel(""); }}
                    className="grid size-11 place-items-center rounded-[12px] bg-[#202E39] text-white disabled:opacity-40">
                    <Plus aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            </details>

            <details className="group">
              <summary className="flex min-h-[73px] cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
                <Bell aria-hidden="true" className="size-[20px] text-mint" />
                <span className="flex-1 text-[14px] font-semibold">Notification preferences</span>
                <ChevronDown aria-hidden="true" className="size-[18px] text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">
                <p className="mb-3 text-[12px] leading-5 text-muted-foreground">Preferences are saved locally. Live notifications aren't connected yet.</p>
                {preferenceLabels.map(([key, label]) => <div key={key} className="flex min-h-[62px] items-center gap-3 border-t border-border py-3">
                  <span className="flex-1 text-[13px] leading-5">{label}</span>
                  <PreferenceSwitch label={label} on={extra.prefs[key]} onChange={(value) => setExtra((current) => ({ ...current, prefs: { ...current.prefs, [key]: value } }))} />
                </div>)}
                <Link to="/notifications" className="mt-3 inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-mint">View notifications <ArrowRight className="size-4" /></Link>
              </div>
            </details>

            <Link to="/help" className="flex min-h-[73px] items-center gap-3 px-5">
              <LifeBuoy aria-hidden="true" className="size-[20px] text-mint" />
              <span className="flex-1 text-[14px] font-semibold">Help and support</span>
              <ArrowRight aria-hidden="true" className="size-[18px] text-muted-foreground" />
            </Link>
            <Link to="/kyc" className="flex min-h-[73px] items-center gap-3 px-5">
              <ShieldCheck aria-hidden="true" className="size-[20px] text-mint" />
              <span className="flex-1 text-[14px] font-semibold">Verification requirements</span>
              <ArrowRight aria-hidden="true" className="size-[18px] text-muted-foreground" />
            </Link>
          </div>
        </section>
        <p className="px-6 pt-8 text-center text-[12px] leading-5 text-muted-foreground">Pocket Market is an independent retail concept.</p>
      </div>
    </Shell>
  );
}
