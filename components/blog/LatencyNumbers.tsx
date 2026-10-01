"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Toggle } from "./DemoFrame";

// Approximate figures popularised by Jeff Dean / Peter Norvig — orders of magnitude, not benchmarks.
const ops: { label: string; ns: number }[] = [
  { label: "L1 cache reference", ns: 1 },
  { label: "Main memory (RAM) reference", ns: 100 },
  { label: "Redis GET on the same machine", ns: 50_000 },
  { label: "Read 1 MB sequentially from RAM", ns: 250_000 },
  { label: "Round trip within a data centre", ns: 500_000 },
  { label: "Random read from SSD", ns: 1_000_000 },
  { label: "Database query (indexed, warm)", ns: 5_000_000 },
  { label: "Read 1 MB sequentially from disk", ns: 20_000_000 },
  { label: "Round trip US → Europe", ns: 150_000_000 },
];

const fmtReal = (ns: number) =>
  ns < 1_000 ? `${ns} ns` : ns < 1_000_000 ? `${ns / 1_000} µs` : `${ns / 1_000_000} ms`;

// "Human scale": pretend 1 ns lasts 1 second
const fmtHuman = (ns: number) => {
  const s = ns;
  if (s < 60) return `${s} sec`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86_400) return `${Math.round(s / 3600)} hours`;
  if (s < 31_536_000) return `${Math.round(s / 86_400)} days`;
  return `${(s / 31_536_000).toFixed(1)} years`;
};

const maxLog = Math.log10(ops[ops.length - 1].ns);

export default function LatencyNumbers() {
  const [human, setHuman] = useState(false);
  return (
    <DemoFrame title="Latency numbers every engineer should know" hint="Log scale">
      <div className="mb-5 flex justify-end">
        <Toggle label="Human scale (1 ns = 1 second)" on={human} onChange={setHuman} />
      </div>
      <ul className="space-y-3">
        {ops.map((o, i) => {
          const pct = Math.max(2, (Math.log10(o.ns) / maxLog) * 100);
          return (
            <li key={o.label}>
              <div className="flex items-baseline justify-between gap-4 text-xs">
                <span className="text-fg">{o.label}</span>
                <span className="shrink-0 font-mono text-muted">{human ? fmtHuman(o.ns) : fmtReal(o.ns)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </DemoFrame>
  );
}
