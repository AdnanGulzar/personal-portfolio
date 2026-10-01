"use client";
import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean };

/** Fades + lifts + un-blurs its children the first time they scroll into view. */
export default function Reveal({ delay = 0, y = 24, blur = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      // start just before it enters the screen, so content is already there after a nav jump
      viewport={{ once: true, margin: "0px 0px 120px 0px" }}
      transition={{ duration: 0.55, delay: Math.min(delay, 0.2), ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
