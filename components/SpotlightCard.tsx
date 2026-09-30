"use client";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

/** Card whose border and surface light up under the cursor, with a subtle 3D tilt. */
export default function SpotlightCard({
  children,
  className = "",
  color = "255,255,255",
  tilt = true,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string; // "r,g,b"
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const rx = useSpring(0, { stiffness: 150, damping: 20 });
  const ry = useSpring(0, { stiffness: 150, damping: 20 });

  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(${color},0.14), transparent 60%)`;
  const border = useMotionTemplate`radial-gradient(300px circle at ${x}px ${y}px, rgba(${color},0.7), transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
        if (tilt) {
          rx.set(((e.clientY - r.top) / r.height - 0.5) * -5);
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
        }
      }}
      onMouseLeave={() => { x.set(-400); y.set(-400); rx.set(0); ry.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group relative rounded-3xl bg-surface ${className}`}
    >
      {/* spotlight border */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: border,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] border border-line" />
      {/* spotlight surface */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
