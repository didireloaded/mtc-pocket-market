import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, ChevronRight, FileCheck2, Headphones, LogOut, MapPin, Package, QrCode, ShieldCheck, UserRound, Wifi, Wallet } from "lucide-react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/mymtc")({
  head: () => ({ meta: [
    { title: "My MTC — Pocket Market" },
    { name: "description", content: "Manage your Pocket Market account and discover MTC services. Live mobile balances require authorised MTC integration." },
    { property: "og:title", content: "My MTC — Pocket Market" },
    { property: "og:type", content: "website" },
  ] }),
  component: MyMTC,
});

function MyMTC() {
  const { user, logout, setAuthOpen, extra } = useStore();
  const isSignedIn = Boolean(user);
  const firstName = user?.displayName?.trim().split(/\s+/)[0] ?? null;

  return (
    <Shell>
      <div className="min-h-[100dvh] bg-[#0A0F14] pb-10 text-white">
        <header className="flex items-center justify-between gap-3 px-6 pb-6 pt-[max(34px,env(safe-area-inset-top))]">
          <div className="min-w-0">
            <p className="text-[14px] text-[#A8B2BC]">{isSignedIn ? "Welcome back" : "Your connected experience"}</p>
            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.045em]">
              {firstName ? firstName : "My MTC"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" aria-label="Notifications" className="grid size-11 place-items-center rounded-full border border-white/10 bg-[#1A232C]">
              <Bell aria-hidden="true" className="size-[20px]" />
            </Link>
            <Link to="/settings" aria-label="Profile and settings" className="grid size-11 place-items-center rounded-full border border-white/10 bg-[#1A232C]">
              <UserRound aria-hidden="true" className="size-[20px]" />
            </Link>
          </div>
        </header>

        <div className="space-y-8 px-6">
          <section aria-labelledby="account-summary-heading" className="rounded-[29px] border border-white/[0.07] bg-gradient-to-br from-[#202D39] to-[#151C23] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] text-[#AAB6C0]">Mobile number</p>
                <h2 id="account-summary-heading" className="mt-1 break-words text-[18px] font-semibold">
                  Not linked
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#70849A]/30 bg-[#2B3B48] px-3 py-2 text-[12px] font-semibold text-[#C7D3DE]">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Not connected
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[#AAB6C0]">
              Your Pocket Market sign-in is separate from your MTC mobile account. Live balances and official verification are not available yet.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[19px] border border-white/[0.05] bg-[#0A0F14]/55 p-4">
                <Wifi aria-hidden="true" className="size-5 text-[#AAB6C0]" />
                <p className="mt-4 text-[12px] text-[#AAB6C0]">Data balance</p>
                <p className="mt-1 text-[21px] font-bold">—</p>
                <p className="mt-1 text-[11px] text-[#AAB6C0]">MTC connection required</p>
              </div>
              <div className="rounded-[19px] border border-white/[0.05] bg-[#0A0F14]/55 p-4">
                <Wallet aria-hidden="true" className="size-5 text-[#AAB6C0]" />
                <p className="mt-4 text-[12px] text-[#AAB6C0]">Airtime balance</p>
                <p className="mt-1 text-[21px] font-bold">—</p>
                <p className="mt-1 text-[11px] text-[#AAB6C0]">MTC connection required</p>
              </div>
            </div>
            {isSignedIn ? <p className="mt-5 break-all text-[12px] leading-5 text-[#AAB6C0]">Pocket Market account: {user?.label}</p>
              : <button type="button" onClick={() => setAuthOpen(true)}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[#202E39]">
                  Sign in to Pocket Market <ArrowRight aria-hidden="true" className="size-4" />
                </button>}
          </section>

          <section aria-labelledby="my-mtc-actions">
            <h2 id="my-mtc-actions" className="text-[19px] font-bold tracking-tight">Quick actions</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Link to="/shop" search={{ q: "data" }} className="flex min-h-[124px] min-w-0 flex-col items-center justify-center gap-2 rounded-[19px] border border-white/[0.07] bg-[#151C23] px-2 py-4 text-center transition-colors hover:bg-[#1E2A35]">
                <Wifi aria-hidden="true" className="size-6 text-[#DD2A1B]" strokeWidth={1.9} />
                <span className="text-[12px] font-semibold leading-4">Explore data</span>
                <span className="text-[11px] leading-4 text-[#AAB6C0]">Browse bundles</span>
              </Link>
              <Link to="/stores" className="flex min-h-[124px] min-w-0 flex-col items-center justify-center gap-2 rounded-[19px] border border-white/[0.07] bg-[#151C23] px-2 py-4 text-center transition-colors hover:bg-[#1E2A35]">
                <MapPin aria-hidden="true" className="size-6 text-[#DD2A1B]" strokeWidth={1.9} />
                <span className="text-[12px] font-semibold leading-4">Find a store</span>
                <span className="text-[11px] leading-4 text-[#AAB6C0]">MTC locations</span>
              </Link>
              <Link to="/esim" className="flex min-h-[124px] min-w-0 flex-col items-center justify-center gap-2 rounded-[19px] border border-white/[0.07] bg-[#151C23] px-2 py-4 text-center transition-colors hover:bg-[#1E2A35]">
                <QrCode aria-hidden="true" className="size-6 text-[#DD2A1B]" strokeWidth={1.9} />
                <span className="text-[12px] font-semibold leading-4">eSIM guide</span>
                <span className="text-[11px] leading-4 text-[#AAB6C0]">How it works</span>
              </Link>
            </div>
          </section>

          <section aria-labelledby="my-mtc-requests">
            <div className="flex items-center justify-between gap-2">
              <h2 id="my-mtc-requests" className="text-[19px] font-bold tracking-tight">Orders and requests</h2>
              <Link to="/orders" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-[#DCE7F0]">
                View all <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <Link to="/orders" className="mt-3 flex min-h-[92px] items-center gap-4 rounded-[19px] border border-white/[0.07] bg-[#151C23] px-4 py-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#DD2A1B]/15">
                <Package aria-hidden="true" className="size-6 text-[#DD2A1B]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold">View your requests</span>
                <span className="mt-1 block text-[12px] leading-5 text-[#AAB6C0]">See account requests and separate local shopping history</span>
              </span>
              <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-[#AAB6C0]" />
            </Link>
          </section>

          <section aria-labelledby="my-mtc-management">
            <h2 id="my-mtc-management" className="text-[19px] font-bold tracking-tight">Manage</h2>
            <div className="mt-4 divide-y divide-white/[0.07] overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#151C23]">
              {([
                { title: "Profile and saved numbers", description: `${extra.numbers.length} saved locally`, to: "/settings" as const, icon: UserRound },
                { title: "Identity and contracts", description: "Official MTC verification required", to: "/kyc" as const, icon: FileCheck2 },
                { title: "Help and support", description: "Guidance and contact options", to: "/help" as const, icon: Headphones },
              ] as const).map(({ title, description, to, icon: Icon }) => (
                <Link to={to} key={title} className="flex min-h-[78px] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-[#D1DBE4]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold">{title}</span>
                    <span className="mt-1 block text-[12px] leading-5 text-[#AAB6C0]">{description}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-[18px] shrink-0 text-[#AAB6C0]" />
                </Link>
              ))}
            </div>
            {isSignedIn && <button type="button" onClick={logout}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 text-[14px] font-semibold text-[#FFC3BC]">
              <LogOut aria-hidden="true" className="size-[18px]" /> Sign out
            </button>}
          </section>

          <p className="text-center text-[12px] leading-5 text-[#AAB6C0]">
            Independent Pocket Market concept. MTC account balances, airtime payments and official identity checks require authorised integrations.
          </p>
        </div>
      </div>
    </Shell>
  );
}
