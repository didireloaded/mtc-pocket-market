import { useEffect } from "react";
import { ArrowRight, CheckCircle2, ShoppingBag, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import mtcLogo from "@/assets/mtc-logo.png.asset.json";

/** First-visit introduction. No timed splash or mandatory multi-screen onboarding. */
export function Welcome() {
  const { ready, authReady, extra, setExtra, browseGuest, setAuthOpen, user, guest } = useStore();
  const visible = ready && authReady && !extra.onboarded && !user && !guest;
  useEffect(() => {
    if (!visible) return;
    // Keep the underlying page out of keyboard and assistive-tech focus while the intro is open.
    const elements = Array.from(document.querySelectorAll<HTMLElement>("#pocket-main, nav[aria-label=\"Main navigation\"]"));
    elements.forEach((element) => element.setAttribute("inert", ""));
    return () => elements.forEach((element) => element.removeAttribute("inert"));
  }, [visible]);
  if (!visible) return null;

  const continueAsGuest = () => {
    setExtra((current) => ({ ...current, onboarded: true }));
    browseGuest();
  };
  const signIn = () => {
    continueAsGuest();
    setAuthOpen(true);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="welcome-title"
      className="fixed inset-0 z-[60] overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(32px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-4">
          <div className="grid h-12 w-24 place-items-center rounded-[14px] bg-primary px-3">
            <img src={mtcLogo.url} alt="MTC" className="w-full object-contain" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">POCKET MARKET</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="relative mb-9 flex h-40 items-center justify-center overflow-hidden rounded-[26px] bg-[#dfeaf5]">
            <div className="absolute -left-2 top-10 h-28 w-24 rounded-[26px] border border-white/80 bg-white/40" />
            <Smartphone aria-hidden="true" className="relative z-10 size-24 stroke-[1.2] text-[#1f5278]" />
            <ShoppingBag aria-hidden="true" className="absolute bottom-5 right-7 size-9 text-[#2e6794]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-mint">Discover · Compare · Connect</p>
          <h1 id="welcome-title" className="mt-3 text-[35px] font-bold leading-[1.08] tracking-[-0.05em]">
            Find the right device for you.
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-muted-foreground">
            Explore phones and laptops, compare buying outright with contract estimates, and save what you like.
            You can browse without signing in.
          </p>
          <div className="mt-7 flex items-center gap-2 text-[13px] leading-5 text-muted-foreground">
            <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-mint" />
            No account needed to explore products.
          </div>
        </div>

        <div className="space-y-3">
          <Button type="button" onClick={continueAsGuest} className="h-14 w-full rounded-full text-[15px] font-semibold shadow-none" autoFocus>
            Explore Pocket Market <ArrowRight className="size-5" />
          </Button>
          <Button type="button" variant="outline" onClick={signIn} className="h-13 w-full rounded-full border-border text-[15px] font-semibold shadow-none">
            Sign in or create an account
          </Button>
          <p className="px-2 pt-2 text-center text-xs leading-5 text-muted-foreground">
            Independent digital retail concept. Pricing, stock and MTC services require official confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
