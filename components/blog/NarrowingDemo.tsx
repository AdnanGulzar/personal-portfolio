"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame, { Toggle } from "./DemoFrame";

// `type` is what the compiler believes `input` is on that line (null when the line doesn't use it).
// `js` is the same line after the types are erased (null when the whole line disappears).
const lines: { ts: string; js: string | null; type: string | null; note?: string }[] = [
  { ts: "type Input = string | number | string[] | null;", js: null, type: null, note: "A type alias exists only for the compiler. It emits no JavaScript at all." },
  { ts: "", js: "", type: null },
  { ts: "function label(input: Input): string {", js: "function label(input) {", type: "string | number | string[] | null", note: "At the top of the function, input could be any member of the union." },
  { ts: "  if (input === null) return \"none\";", js: "  if (input === null) return \"none\";", type: "null", note: "Inside this check, the only value that passes is null." },
  { ts: "  // null is gone from here on", js: "  // null is gone from here on", type: "string | number | string[]", note: "Because the null case returned, the compiler removes null for every line below." },
  { ts: "  if (typeof input === \"number\") {", js: "  if (typeof input === \"number\") {", type: "number", note: "typeof is a real runtime check, and TypeScript understands what it proves." },
  { ts: "    return input.toFixed(2);", js: "    return input.toFixed(2);", type: "number", note: ".toFixed is allowed because input is definitely a number here." },
  { ts: "  }", js: "  }", type: null },
  { ts: "  if (Array.isArray(input)) {", js: "  if (Array.isArray(input)) {", type: "string[]", note: "Array.isArray narrows to the array member of the union." },
  { ts: "    return input.join(\", \");", js: "    return input.join(\", \");", type: "string[]" },
  { ts: "  }", js: "  }", type: null },
  { ts: "  return input.toUpperCase();", js: "  return input.toUpperCase();", type: "string", note: "Every other option has been ruled out, so only string is left. Delete one of the checks above and this line becomes a compile error." },
  { ts: "}", js: "}", type: null },
];

export default function NarrowingDemo() {
  const [sel, setSel] = useState(2);
  const [showJs, setShowJs] = useState(false);
  const cur = lines[sel];

  return (
    <DemoFrame title="Follow the compiler as it narrows a type" hint={showJs ? "Emitted JavaScript" : "Click a line"}>
      <div className="mb-4 flex flex-wrap gap-2">
        <Toggle label="Show the JavaScript that actually runs" on={showJs} onChange={setShowJs} />
      </div>

      <pre className="overflow-x-auto rounded-2xl border border-line bg-black/40 py-3 font-mono text-[13px] leading-7">
        {lines.map((l, n) => {
          const gone = showJs && l.js === null;
          const text = showJs ? (l.js ?? l.ts) : l.ts;
          const clickable = !showJs && l.type !== null;
          return (
            <div
              key={n}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={() => clickable && setSel(n)}
              onKeyDown={(e) => clickable && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(n))}
              className={`whitespace-pre px-4 transition-colors ${gone ? "text-subtle line-through opacity-50" : ""} ${!showJs && sel === n ? "bg-[#a855f7]/20 text-white" : "text-muted"} ${clickable ? "cursor-pointer hover:bg-white/[0.04]" : ""}`}
            >
              <span className="mr-4 inline-block w-4 select-none text-right text-subtle">{n + 1}</span>
              {text || " "}
            </div>
          );
        })}
      </pre>

      <div className="mt-4 min-h-24 rounded-2xl border border-line p-4">
        <AnimatePresence mode="wait" initial={false}>
          {showJs ? (
            <motion.p key="js" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm leading-relaxed text-muted">
              The type alias and every annotation are gone. The <code className="font-mono text-fg">null</code>, <code className="font-mono text-fg">typeof</code> and <code className="font-mono text-fg">Array.isArray</code> checks stay, because they're ordinary JavaScript that you wrote. TypeScript only <em>reads</em> them to narrow the type.
            </motion.p>
          ) : (
            <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Type of input on line {sel + 1}</p>
              <p className="mt-1.5 break-words font-mono text-sm text-[#d2a8ff]">{cur.type}</p>
              {cur.note && <p className="mt-2 text-sm leading-relaxed text-muted">{cur.note}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DemoFrame>
  );
}
