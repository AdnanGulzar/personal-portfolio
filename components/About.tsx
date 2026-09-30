"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { profile } from "@/lib/data";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{children}</motion.span>;
}

/** Scroll-scrubbed text: each word lights up as you scroll through the section. */
export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = profile.summary.split(" ");

  return (
    <section id="about" className="relative mx-auto max-w-5xl px-6 py-32 sm:py-40">
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-subtle">
        <span className="h-px w-6 bg-white/30" /> About
      </span>
      <p ref={ref} className="mt-8 text-[clamp(1.6rem,3.6vw,2.75rem)] font-medium leading-[1.25] tracking-tight text-white">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </section>
  );
}
