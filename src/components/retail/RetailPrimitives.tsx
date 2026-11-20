import type { ReactNode } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Shared editorial building blocks for the Pocket Market retail experience. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[12px] font-bold uppercase tracking-[0.13em] text-mint", className)}>{children}</p>;
}

export function SectionHeading({ title, description, to, action }: {
  title: string; description?: string; to?: "/shop" | "/find" | "/compare" | "/orders"; action?: string;
}) {
  return <div className="flex items-end justify-between gap-3">
    <div className="min-w-0"><h2 className="text-[21px] font-bold leading-tight tracking-[-0.035em]">{title}</h2>
      {description && <p className="mt-1 text-[14px] leading-5 text-muted-foreground">{description}</p>}
    </div>
    {to && <Link to={to} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[13px] font-semibold text-mint">
      {action ?? "View all"}<ArrowRight className="size-4" />
    </Link>}
  </div>;
}

export function ConceptNotice({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="note" className={cn("flex gap-3 rounded-[13px] border border-[#c8d8e4] bg-[#edf4f7] p-4 text-[#234761]", className)}>
    <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
    <p className="text-[13px] leading-[1.6]">{children}</p>
  </div>;
}

export function PriceRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={cn("flex items-baseline justify-between gap-4 py-2 text-[14px]", emphasis && "border-t border-border pt-4 font-bold")}>
    <span className={cn(emphasis ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    <span className="text-right font-semibold tabular-nums">{value}</span>
  </div>;
}

export function ProductStage({ src, alt, priority = false, className }: {
  src: string; alt: string; priority?: boolean; className?: string;
}) {
  return <div className={cn("grid aspect-square place-items-center overflow-hidden rounded-[15px] bg-stage p-4", className)}>
    <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className="h-full max-h-full w-full object-contain" />
  </div>;
}

export function RetailPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={cn("rounded-[15px] border-border bg-card p-5 shadow-none", className)}>{children}</Card>;
}
