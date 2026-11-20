import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Advisory only. Browsing cached resources does not imply offline checkout or syncing. */
export function NetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(window.navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(8px,env(safe-area-inset-top))] z-[80] px-4">
      <div role="status" aria-live="polite"
        className="mx-auto flex max-w-md items-start gap-3 rounded-[16px] border border-[#a7bbd0] bg-[#eaf2f9] p-3 text-[#26445c] shadow-sm">
        <WifiOff aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <p className="text-[13px] leading-5"><strong>You're offline.</strong> You may still see saved content, but account actions, orders and live updates need an internet connection.</p>
      </div>
    </div>
  );
}
