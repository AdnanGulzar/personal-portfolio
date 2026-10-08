"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

// If each backend call is slow 1% of the time (its p99), a request that waits for N calls
// in parallel is slow whenever any one of them is: 1 - 0.99^N. Exact probability.
export default function TailLatencyDemo() {
  const [fanout, setFanout] = useState(20);
  const [p, setP] = useState(1);
  const slow = 1 - (1 - p / 100) ** fanout;
  const pct = slow * 100;

  return (
    <DemoFrame title="Fan-out makes rare slowness common">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Backend calls per page" value={fanout} min={1} max={100} onChange={setFanout} />
        <Slider label="Chance each call is slow" value={p} min={0.1} max={5} step={0.1} format={(v) => `${v.toFixed(1)}%`} onChange={setP} />
      </div>

      {/* 100 page loads */}
      <div className="mt-6 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1" aria-hidden>
        {Array.from({ length: 100 }, (_, i) => (
          <motion.span key={i} className="aspect-square rounded-[3px]" initial={false} animate={{ backgroundColor: i < Math.round(pct) ? "#ef4444" : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Page loads that hit at least one slow call</span>
        <span className="font-mono text-2xl" style={{ color: pct > 10 ? "#ef4444" : "#10b981" }}>{pct.toFixed(pct < 10 ? 1 : 0)}%</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Each call is slow only {p.toFixed(1)}% of the time, but the page waits for all {fanout} of them, so it&apos;s as slow as the slowest one.
        That&apos;s why at scale you track p99 latency, not the average: your users experience the tail.
      </p>
    </DemoFrame>
  );
}
