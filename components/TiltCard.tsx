"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/** Card that tilts in 3D toward the cursor over a spinning colour glow (same feel as the hero code window). */
export default function TiltCard({
  children,
  className = "",
  wrapperClassName = "",
  max = 7, // max tilt in degrees
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max * 0.8, -max * 0.8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 120, damping: 18 });

  return (
    <div
      className={`group/tilt relative ${wrapperClassName}`}
      style={{ perspective: 1200 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 animate-spin-slow rounded-full opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover/tilt:opacity-[0.22]"
        style={{ background: "conic-gradient(from 0deg, #3b82f6, #a855f7, #ec4899, #10b981, #3b82f6)" }}
      />
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`card-border relative rounded-3xl bg-black/60 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
