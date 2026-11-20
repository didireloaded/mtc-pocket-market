import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Truck, MapPin } from "lucide-react";
import { useEffect } from "react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — MTC Store" }, { name: "description", content: "Delivery updates for your MTC orders." }, { property: "og:title", content: "Notifications — MTC Store" }, { property: "og:description", content: "Delivery updates for your MTC orders." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Notifications,
});
function Notifications() {
  const { notices, markAllRead } = useStore();
  useEffect(() => { const t = setTimeout(markAllRead, 1500); return () => clearTimeout(t); }, [notices.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Shell>
      <div className="px-5 pt-6">
        <Link to="/" aria-label="Back" className="grid size-11 place-items-center rounded-full bg-card"><ArrowLeft className="size-5" /></Link>
        <h1 className="mt-5 text-3xl font-bold">Notifications</h1>
        {!notices.length && <p className="py-16 text-center text-muted-foreground">No updates yet. We'll let you know when an order ships.</p>}
        <div className="mt-4 space-y-3">
          {notices.map((n) => (
            <Link key={n.key} to="/orders" className="flex gap-3 rounded-[20px] bg-card p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">{n.title.includes("shipped") ? <Truck className="size-5" /> : <MapPin className="size-5" />}</span>
              <div className="flex-1"><p className="font-semibold">{n.title}{!n.read && <span className="ml-2 inline-block size-2 rounded-full bg-primary align-middle" />}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p><p className="mt-1 text-[11px] text-muted-foreground">{new Date(n.at).toLocaleString()}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
