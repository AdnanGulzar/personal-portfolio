"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

// Illustrative sizes (gzipped): a React-style runtime, and the code for one component.
const RUNTIME_KB = 45, COMPONENT_KB = 8, LOADER_KB = 1;

function strategies(total: number, interactive: number) {
  return [
    {
      name: "Full hydration",
      who: "Classic SPA or SSR",
      kb: RUNTIME_KB + total * COMPONENT_KB,
      hydrated: total,
      note: "Every component's code ships and runs again in the browser, even the static ones.",
    },
    {
      name: "Server Components",
      who: "React Server Components",
      kb: RUNTIME_KB + interactive * COMPONENT_KB,
      hydrated: interactive,
      note: "Only client components ship code. The runtime still loads to manage them and navigation.",
    },
    {
      name: "Islands",
      who: "Astro and similar",
      kb: interactive ? RUNTIME_KB + interactive * COMPONENT_KB : 0,
      hydrated: interactive,
      note: "The page is plain HTML. Each interactive island loads on its own, and no islands means no JavaScript at all.",
    },
    {
      name: "Resumability",
      who: "Qwik",
      kb: LOADER_KB,
      hydrated: 0,
      note: "Nothing is replayed on load. A tiny loader waits, and a handler's code downloads only when it's first used.",
    },
  ];
}

export default function HydrationCostDemo() {
  const [total, setTotal] = useState(40);
  const [pct, setPct] = useState(15);
  const interactive = Math.round((total * pct) / 100);
  const rows = strategies(total, interactive);
  const max = Math.max(...rows.map((r) => r.kb), 1);

  return (
    <DemoFrame title="How much JavaScript runs before the page responds?" hint="Illustrative sizes">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Components on the page" value={total} min={5} max={100} onChange={setTotal} />
        <Slider label="Of those, interactive" value={pct} min={0} max={100} step={5} format={(v) => `${v}% (${Math.round((total * v) / 100)})`} onChange={setPct} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
              <span className="text-fg">{r.name} <span className="text-subtle">· {r.who}</span></span>
              <span className="font-mono text-fg">{r.kb} KB · {r.hydrated} hydrated</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full min-w-[3px] rounded-full"
                initial={false}
                animate={{ width: `${(r.kb / max) * 100}%`, backgroundColor: r.kb > 200 ? "#ef4444" : r.kb > 80 ? "#f59e0b" : "#10b981" }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{r.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-subtle">
        Assumes a {RUNTIME_KB} KB framework runtime and {COMPONENT_KB} KB per component, gzipped. Real numbers vary a lot by framework and app; the shape of the difference is what matters.
      </p>
    </DemoFrame>
  );
}
