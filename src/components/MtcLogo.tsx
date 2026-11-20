import { cn } from "@/lib/utils";

/** Official MTC artwork supplied for this Pocket Market design. No colour tile behind the mark. */
export function MtcLogo({ className }: { className?: string }) {
  return (
    <img
      src="/mtc-brand-logo.webp"
      alt="MTC"
      width={256}
      height={262}
      decoding="async"
      className={cn("block shrink-0 object-contain", className)}
    />
  );
}
