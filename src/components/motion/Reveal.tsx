"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { easings, durations } from "@/lib/motion/easings";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 32,
  duration = durations.slow,
  once = true,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay, ease: easings.signature }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
