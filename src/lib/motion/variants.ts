import type { Variants } from "framer-motion";
import { easings, durations } from "./easings";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.signature },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.signature },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: easings.outExpo },
  },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay, delayChildren: 0.1 },
  },
});
