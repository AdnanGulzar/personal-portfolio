"use client";
import { motion } from "motion/react";
import { asset } from "@/lib/utils";

/** Abstract, animated product preview tinted with the project's accent colour. */
export default function ProjectVisual({ accent, variant = 0, image, alt = "", stack = [] }: { accent: string; variant?: number; image?: string; alt?: string; stack?: string[] }) {
  const bars = [38, 62, 45, 80, 56, 92, 70, 84, 60, 96, 74, 88];
  return (
    <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl border border-line bg-black">
      <div aria-hidden className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(80% 70% at 50% 100%, ${accent}40, transparent 70%)` }} />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60 [mask-image:none]" />

      {/* window chrome */}
      <div className="absolute inset-x-5 top-5 bottom-0 rounded-t-xl border border-b-0 border-line bg-[#0a1430]/90 backdrop-blur transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 h-2 w-24 rounded-full bg-white/10" />
        </div>

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(image)} alt={alt} loading="lazy" className="h-[calc(100%-33px)] w-full object-cover object-top" />
        )}

        {!image && variant % 3 === 0 && (
          <div className="flex h-[calc(100%-33px)] items-end gap-1.5 p-4">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 rounded-t-sm"
                style={{ background: `linear-gradient(to top, ${accent}22, ${accent})` }}
              />
            ))}
          </div>
        )}

        {!image && variant % 3 === 1 && (
          <div className="space-y-2.5 p-4 font-mono text-[11px]">
            {/* no screenshot yet: show the project's own stack rather than made-up text */}
            {(stack.length ? stack.slice(0, 4) : ["Frontend", "API", "Database", "Deploy"]).map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.18 }}
                className="flex items-center gap-2"
              >
                <span className="size-1.5 rounded-full" style={{ background: accent }} />
                <span className="text-muted">{t}</span>
                <span className="text-subtle">✓</span>
                <span className="ml-auto h-1.5 rounded-full bg-white/10" style={{ width: `${30 + i * 12}%` }} />
              </motion.div>
            ))}
          </div>
        )}

        {!image && variant % 3 === 2 && (
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 180, damping: 18 }}
                className="aspect-[4/3] rounded-lg border border-line"
                style={{ background: i === 1 ? `${accent}55` : "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
