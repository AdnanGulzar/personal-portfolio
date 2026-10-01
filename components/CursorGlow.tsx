"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";

/** A soft spotlight that trails the pointer across the whole page (desktop only). */
export default function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 90, damping: 20 });
  const sy = useSpring(y, { stiffness: 90, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(255,255,255,0.075), transparent 45%)`;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div aria-hidden style={{ background: bg }} className="pointer-events-none fixed inset-0 z-30 hidden md:block" />;
}
