import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { spinFrameFromDrag, spinViewLabel, wrapFrame, type ProductSpin } from "@/lib/product-spins";

type Props = {
  productName: string;
  spin: ProductSpin;
  onUnavailable: () => void;
  className?: string;
};

type PointerStart = { id: number; x: number; y: number; frame: number };

/** Real-photo orbit. No generated 3D, CSS phone rotation or invented angles. */
export function Product360Viewer({ productName, spin, onUnavailable, className = "" }: Props) {
  const [frame, setFrame] = useState(spin.frontIndex);
  const [displayed, setDisplayed] = useState(spin.frontIndex);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const pointer = useRef<PointerStart | null>(null);
  const cached = useRef<Set<string>>(new Set([spin.frames[spin.frontIndex]!]));

  // Keep the previous frame on screen until the next photograph has loaded.
  // Fast drags cannot race an older request back over the most recent angle.
  useEffect(() => {
    if (frame === displayed) return;
    let active = true;
    const image = new Image();
    image.onload = () => {
      cached.current.add(spin.frames[frame]!);
      if (active) setDisplayed(frame);
    };
    image.onerror = () => { if (active) onUnavailable(); };
    image.src = spin.frames[frame]!;
    return () => { active = false; };
  }, [frame, displayed, spin, onUnavailable]);

  // Only prefetch adjacent frames after explicit interaction, and avoid
  // speculative downloads for customers using data-saver mode.
  useEffect(() => {
    if (!interacted) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    for (const offset of [-1, 1]) {
      const src = spin.frames[wrapFrame(frame + offset, spin.frames.length)]!;
      if (cached.current.has(src)) continue;
      cached.current.add(src);
      const image = new Image();
      image.src = src;
    }
  }, [frame, interacted, spin]);

  const goTo = useCallback((index: number) => {
    setInteracted(true);
    setFrame(wrapFrame(index, spin.frames.length));
  }, [spin.frames.length]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current || !event.isPrimary) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, frame };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 5 || Math.abs(dx) < Math.abs(dy)) return;
    setInteracted(true);
    setFrame(spinFrameFromDrag(start.frame, dx, spin.frames.length));
  };
  const stopPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(frame + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); goTo(frame - 1); }
    else if (event.key === "Home") { event.preventDefault(); goTo(spin.frontIndex); }
    else if (event.key === "End") { event.preventDefault(); goTo(spin.frames.length - 1); }
  };

  const view = spinViewLabel(frame, spin);

  return (
    <div className={`flex h-full min-h-0 flex-col items-center justify-center ${className}`}>
      <div role="slider" tabIndex={0}
        aria-label={`Rotate ${productName} through 360 degrees`}
        aria-valuemin={0} aria-valuemax={spin.frames.length - 1}
        aria-valuenow={frame} aria-valuetext={view}
        aria-describedby="product-spin-instructions"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={stopPointer} onPointerCancel={stopPointer} onLostPointerCapture={() => { pointer.current = null; setDragging(false); }}
        onKeyDown={handleKeyDown}
        style={{ touchAction: "pan-y" }}
        className={`relative flex min-h-0 w-full flex-1 cursor-grab select-none items-center justify-center px-5 pb-1 pt-[68px] outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-primary ${dragging ? "cursor-grabbing" : ""}`}>
        <img src={spin.frames[displayed]} alt={`${productName}, ${spinViewLabel(displayed, spin)}`}
          loading="eager" decoding="async" draggable={false} onError={onUnavailable}
          className="pointer-events-none h-full max-h-[485px] w-full select-none object-contain drop-shadow-[0_18px_16px_rgba(32,46,57,0.1)]" />
      </div>
      <div className="relative z-20 flex w-full flex-col items-center gap-2 px-4 pb-6">
        <p id="product-spin-instructions" className="flex items-center gap-2 text-center text-[12px] font-medium text-[#445462]">
          <ArrowLeftRight aria-hidden="true" className="size-4" />
          Drag to rotate · {view}
        </p>
        <div className="flex items-center justify-center gap-2" aria-label="Rotation controls">
          <button type="button" onClick={() => goTo(spin.frontIndex)}
            aria-pressed={frame === spin.frontIndex}
            className={`min-h-11 rounded-full px-4 text-[13px] font-semibold ${frame === spin.frontIndex ? "bg-[#202E39] text-white" : "bg-white/90 text-[#202E39]"}`}>
            Front
          </button>
          <button type="button" onClick={() => goTo(spin.backIndex)}
            aria-pressed={frame === spin.backIndex}
            className={`min-h-11 rounded-full px-4 text-[13px] font-semibold ${frame === spin.backIndex ? "bg-[#202E39] text-white" : "bg-white/90 text-[#202E39]"}`}>
            Back
          </button>
          <button type="button" onClick={() => goTo(spin.frontIndex)} aria-label="Reset to front view"
            className="grid size-11 place-items-center rounded-full bg-white/90 text-[#202E39]">
            <RotateCcw aria-hidden="true" className="size-[17px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
