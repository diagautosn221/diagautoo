"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easings } from "@/lib/motion/easings";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  as = "h1",
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: easings.signature },
              },
            }}
          >
            {word}
            {wi < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
