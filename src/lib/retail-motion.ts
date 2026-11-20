import type { Variants } from "framer-motion";

/**
 * Small motion system for Pocket Market. Prefer opacity and transform,
 * with restrained travel and no looping animations.
 */
export const revealGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.025 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 430, damping: 35, mass: 0.8 },
  },
};

export const pressClass =
  "transition-transform duration-150 ease-out active:scale-[0.96] motion-reduce:transform-none";
