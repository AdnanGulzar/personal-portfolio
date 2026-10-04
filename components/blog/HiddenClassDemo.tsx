"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import DemoFrame from "./DemoFrame";

// Each preset is the order properties get added to an object.
const presets = [
  ["x", "y"],
  ["y", "x"],
  ["x", "y", "z"],
  ["id", "x", "y"],
  ["x", "y", "label"],
  ["x"],
];

const icStates = [
  { max: 0, name: "Uninitialised", color: "#6b7280", note: "getX hasn't run yet, so V8 has no feedback about it." },
  { max: 1, name: "Monomorphic", color: "#10b981", note: "One shape seen. The cache stores that hidden class and the offset of x, so a property read is one comparison and one memory load. This is the fast case optimising compilers love." },
  { max: 4, name: "Polymorphic", color: "#f59e0b", note: "A few shapes seen. V8 keeps a short list of (shape, offset) pairs and checks each one in turn. Still fairly quick, but slower than monomorphic and harder to optimise." },
  { max: Infinity, name: "Megamorphic", color: "#ef4444", note: "Too many shapes. V8 gives up on the per-site cache and falls back to a slower, generic lookup. Optimised code can't make strong assumptions here." },
];

const literal = (props: string[]) => `{ ${props.map((p) => `${p}: …`).join(", ")} }`;

export default function HiddenClassDemo() {
  const [calls, setCalls] = useState<string[][]>([]);
  // hidden classes in the order V8 first sees them
  const shapes: string[][] = [];
  for (const c of calls) if (!shapes.some((s) => s.join() === c.join())) shapes.push(c);
  const ic = icStates.find((s) => shapes.length <= s.max)!;

  return (
    <DemoFrame title="Hidden classes and inline caches" hint={`${calls.length} call${calls.length === 1 ? "" : "s"}`}>
      <pre className="overflow-x-auto rounded-2xl border border-line bg-black/40 px-4 py-3 font-mono text-[13px] leading-7 text-muted">
        <span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">getX</span>(obj) {"{"} <span className="text-[#ff7b72]">return</span> obj.x; {"}"}
      </pre>

      <p className="mt-4 text-xs text-muted">Pass an object to getX:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.join()}
            type="button"
            onClick={() => setCalls([...calls, p])}
            className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted transition hover:border-line-strong hover:text-white"
          >
            {literal(p)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCalls([])}
          disabled={!calls.length}
          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-white disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Hidden classes created</p>
          <ul className="mt-2 space-y-1.5">
            <AnimatePresence initial={false}>
              {shapes.map((s, i) => (
                <motion.li key={s.join()} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="font-mono text-xs leading-relaxed">
                  <span className="text-fg">Map{i + 1}</span>
                  <span className="text-subtle"> {"{}"}{s.map((p) => ` → +${p}`).join("")}</span>
                  <span className="block text-[11px] text-muted">x at slot {s.indexOf("x")}</span>
                </motion.li>
              ))}
            </AnimatePresence>
            {!shapes.length && <li className="text-xs text-subtle">None yet</li>}
          </ul>
        </div>

        <motion.div className="rounded-2xl border p-3" animate={{ borderColor: `${ic.color}88` }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Inline cache at obj.x</p>
          <p className="mt-2 text-lg font-semibold" style={{ color: ic.color }}>{ic.name}</p>
          <p className="mt-0.5 font-mono text-[11px] text-subtle">{shapes.length} shape{shapes.length === 1 ? "" : "s"} seen</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{ic.note}</p>
        </motion.div>
      </div>
    </DemoFrame>
  );
}
