"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame from "./DemoFrame";

const stages = ["JavaScript", "Style", "Layout", "Paint", "Composite"] as const;

// Which pipeline stages a change to each property makes the browser re-run.
const changes = [
  { key: "width", label: "width: 160px", runs: [0, 1, 2, 3, 4], style: { width: "62%" }, note: "Geometry changed, so the browser must recalculate layout for this element and everything it pushes around, then repaint and recomposite. This is the expensive path." },
  { key: "color", label: "background: pink", runs: [0, 1, 3, 4], style: { background: "#ec4899" }, note: "Nothing moved, so layout is skipped. But the pixels changed, so the element is repainted and recomposited." },
  { key: "transform", label: "transform: translateX()", runs: [0, 1, 4], style: { transform: "translateX(40%)" }, note: "On its own compositor layer, a transform just moves an already-painted layer. No layout, no paint, and the compositor thread can animate it even while the main thread is busy." },
  { key: "opacity", label: "opacity: 0.4", runs: [0, 1, 4], style: { opacity: 0.4 }, note: "Like transform, opacity can be applied by the compositor to a layer that's already painted. That's why these two are the go-to properties for smooth animation." },
] as const;

export default function RenderPipelineDemo() {
  const [k, setK] = useState<(typeof changes)[number]["key"]>("width");
  const c = changes.find((x) => x.key === k)!;

  return (
    <DemoFrame title="What does changing this property cost?" hint="Pick a change">
      <div className="flex flex-wrap gap-2">
        {changes.map((x) => (
          <button
            key={x.key}
            type="button"
            aria-pressed={x.key === k}
            onClick={() => setK(x.key)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${x.key === k ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* wrapping pills on phones, one row of five from sm up */}
      <ol className="mt-5 flex flex-wrap gap-1.5 sm:grid sm:grid-cols-5">
        {stages.map((s, i) => {
          const on = (c.runs as readonly number[]).includes(i);
          return (
            <li key={s} className="min-w-0">
              <motion.div
                initial={false}
                animate={{ opacity: on ? 1 : 0.3 }}
                className={`flex items-baseline gap-2 rounded-xl border px-3 py-2 sm:block sm:px-1 sm:py-3 sm:text-center ${on ? "border-[#a855f7]/60 bg-[#a855f7]/10" : "border-line"}`}
              >
                <span className="block truncate text-xs text-fg">{s}</span>
                <span className="block font-mono text-[10px] text-subtle sm:mt-1">{on ? "runs" : "skipped"}</span>
              </motion.div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 h-20 overflow-hidden rounded-2xl border border-line bg-black/40 p-4">
        <motion.div
          key={c.key}
          initial={{ width: "30%", background: "#3b82f6", transform: "translateX(0%)", opacity: 1 }}
          animate={{ width: "30%", background: "#3b82f6", transform: "translateX(0%)", opacity: 1, ...c.style }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-lg"
        />
      </div>

      <p className="mt-4 min-h-16 text-sm leading-relaxed text-muted">{c.note}</p>
    </DemoFrame>
  );
}
