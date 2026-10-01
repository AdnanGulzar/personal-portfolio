"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

type Metric = {
  key: string;
  name: string;
  what: string;
  min: number;
  max: number;
  step: number;
  good: number;
  poor: number;
  fmt: (v: number) => string;
};

// Thresholds from web.dev (75th percentile of page loads)
const metrics: Metric[] = [
  { key: "lcp", name: "LCP", what: "Largest Contentful Paint — when the main content shows up", min: 0.5, max: 6, step: 0.1, good: 2.5, poor: 4, fmt: (v) => `${v.toFixed(1)} s` },
  { key: "inp", name: "INP", what: "Interaction to Next Paint — how fast the page reacts to taps and clicks", min: 40, max: 800, step: 10, good: 200, poor: 500, fmt: (v) => `${v} ms` },
  { key: "cls", name: "CLS", what: "Cumulative Layout Shift — how much things jump around", min: 0, max: 0.5, step: 0.01, good: 0.1, poor: 0.25, fmt: (v) => v.toFixed(2) },
];

const rate = (m: Metric, v: number) =>
  v <= m.good ? { label: "Good", color: "#10b981" } : v <= m.poor ? { label: "Needs improvement", color: "#f59e0b" } : { label: "Poor", color: "#ef4444" };

export default function WebVitals() {
  const [vals, setVals] = useState<Record<string, number>>({ lcp: 3.2, inp: 260, cls: 0.06 });
  const passes = metrics.every((m) => vals[m.key] <= m.good);

  return (
    <DemoFrame title="Core Web Vitals: drag to see how Google rates a page">
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => {
          const v = vals[m.key];
          const r = rate(m, v);
          const pct = ((v - m.min) / (m.max - m.min)) * 100;
          return (
            <div key={m.key} className="rounded-2xl border p-4 transition-colors" style={{ borderColor: `${r.color}55` }}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm font-semibold text-white">{m.name}</span>
                <span className="text-[11px] font-medium" style={{ color: r.color }}>{r.label}</span>
              </div>
              <div className="mt-2 font-mono text-2xl text-white">{m.fmt(v)}</div>
              {/* threshold track */}
              <div className="relative mt-3 flex h-1.5 overflow-hidden rounded-full">
                <span className="h-full bg-[#10b981]/60" style={{ width: `${((m.good - m.min) / (m.max - m.min)) * 100}%` }} />
                <span className="h-full bg-[#f59e0b]/60" style={{ width: `${((m.poor - m.good) / (m.max - m.min)) * 100}%` }} />
                <span className="h-full flex-1 bg-[#ef4444]/60" />
                <motion.span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black" animate={{ left: `${pct}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              </div>
              <div className="mt-4">
                <Slider label={m.what} value={v} min={m.min} max={m.max} step={m.step} format={() => ""} onChange={(nv) => setVals((s) => ({ ...s, [m.key]: nv }))} />
              </div>
            </div>
          );
        })}
      </div>
      <motion.p
        key={String(passes)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-5 text-center text-sm font-medium ${passes ? "text-[#10b981]" : "text-[#f59e0b]"}`}
      >
        {passes ? "✓ Passes Core Web Vitals" : "✗ Doesn't pass yet: every metric needs to be in the green"}
      </motion.p>
    </DemoFrame>
  );
}
