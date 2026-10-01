"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/** Section label (e.g. "EXPERIENCE") that gets a coloured underline while you're in its section. */
export default function Eyebrow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    // Same band as the nav's scrollspy: the section crossing the middle of the viewport is "current"
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "-45% 0px -50% 0px" });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center gap-2 pb-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-500 ${active ? "text-white" : "text-subtle"}`}
    >
      <span className={`h-px w-6 transition-colors duration-500 ${active ? "bg-white/70" : "bg-white/30"}`} />
      {children}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899] shadow-[0_0_10px_rgba(168,85,247,0.6)]"
        initial={false}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
