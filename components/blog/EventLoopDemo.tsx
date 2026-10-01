"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import DemoFrame from "./DemoFrame";

const code = [
  `console.log("start");`,
  `setTimeout(() => console.log("timeout"), 0);`,
  `Promise.resolve().then(() => console.log("promise"));`,
  `queueMicrotask(() => console.log("microtask"));`,
  `console.log("end");`,
];

type Step = {
  line?: number; // highlighted line (0-based)
  stack: string[]; // bottom → top
  webApis: string[];
  micro: string[];
  tasks: string[];
  out: string[];
  note: string;
};

const steps: Step[] = [
  { stack: [], webApis: [], micro: [], tasks: [], out: [], note: "The script is loaded. Nothing has run yet. Press Next to step through it." },
  { line: 0, stack: ["script", "console.log"], webApis: [], micro: [], tasks: [], out: ["start"], note: "The whole script runs as one task. console.log is pushed onto the call stack, prints, and pops off." },
  { line: 1, stack: ["script", "setTimeout"], webApis: ["timer (0 ms) → cb"], micro: [], tasks: [], out: ["start"], note: "setTimeout isn't part of JavaScript. It hands the callback to the browser's timer and returns immediately." },
  { line: 2, stack: ["script", "then"], webApis: [], micro: ["promise cb"], tasks: ["timeout cb"], out: ["start"], note: "The timer has already expired, so its callback waits in the task queue. The promise is already resolved, so .then queues its callback as a microtask." },
  { line: 3, stack: ["script", "queueMicrotask"], webApis: [], micro: ["promise cb", "microtask cb"], tasks: ["timeout cb"], out: ["start"], note: "queueMicrotask adds a second callback to the microtask queue." },
  { line: 4, stack: ["script", "console.log"], webApis: [], micro: ["promise cb", "microtask cb"], tasks: ["timeout cb"], out: ["start", "end"], note: "Still synchronous: \"end\" prints before any callback, even the 0 ms timeout." },
  { stack: [], webApis: [], micro: ["promise cb", "microtask cb"], tasks: ["timeout cb"], out: ["start", "end"], note: "The script finished and the call stack is empty. Before taking another task, the event loop drains the entire microtask queue." },
  { stack: ["promise cb"], webApis: [], micro: ["microtask cb"], tasks: ["timeout cb"], out: ["start", "end", "promise"], note: "First microtask runs." },
  { stack: ["microtask cb"], webApis: [], micro: [], tasks: ["timeout cb"], out: ["start", "end", "promise", "microtask"], note: "Second microtask runs. Microtasks queued now would also run before the timeout." },
  { stack: ["timeout cb"], webApis: [], micro: [], tasks: [], out: ["start", "end", "promise", "microtask", "timeout"], note: "Microtasks are empty, so the browser may paint, then the event loop takes the next task: the timeout callback." },
  { stack: [], webApis: [], micro: [], tasks: [], out: ["start", "end", "promise", "microtask", "timeout"], note: "Done. Final order: start, end, promise, microtask, timeout." },
];

function Lane({ title, items, color, vertical }: { title: string; items: string[]; color: string; vertical?: boolean }) {
  return (
    <div className="rounded-2xl border border-line p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{title}</p>
      <div className={`mt-2 flex min-h-9 gap-1.5 ${vertical ? "flex-col-reverse" : "flex-wrap"}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((it) => (
            <motion.span
              key={it}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border px-2.5 py-1 font-mono text-xs text-fg"
              style={{ borderColor: `${color}66`, background: `${color}1a` }}
            >
              {it}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const btn = "inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-white disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted";

export default function EventLoopDemo() {
  const [i, setI] = useState(0);
  const s = steps[i];

  return (
    <DemoFrame title="The event loop, one step at a time" hint={`Step ${i} / ${steps.length - 1}`}>
      <pre className="overflow-x-auto rounded-2xl border border-line bg-black/40 py-3 font-mono text-[13px] leading-7">
        {code.map((l, n) => (
          <div key={n} className={`px-4 transition-colors ${s.line === n ? "bg-[#a855f7]/20 text-white" : "text-muted"}`}>
            <span className="mr-4 select-none text-subtle">{n + 1}</span>
            {l}
          </div>
        ))}
      </pre>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Lane title="Call stack" items={s.stack} color="#a855f7" vertical />
        <Lane title="Web APIs (browser)" items={s.webApis} color="#3b82f6" />
        <Lane title="Microtask queue" items={s.micro} color="#10b981" />
        <Lane title="Task queue" items={s.tasks} color="#f59e0b" />
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-black/40 p-3 font-mono text-xs">
        <p className="text-[10px] uppercase tracking-[0.2em] text-subtle">Console</p>
        <div className="mt-2 min-h-5 space-y-0.5 text-fg">
          {s.out.map((o, n) => <div key={n}>› {o}</div>)}
        </div>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-relaxed text-muted">{s.note}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => setI(i - 1)} disabled={i === 0}>
          <ChevronLeft className="size-3.5" /> Back
        </button>
        <button type="button" className={btn} onClick={() => setI(i + 1)} disabled={i === steps.length - 1}>
          Next <ChevronRight className="size-3.5" />
        </button>
        <button type="button" className={btn} onClick={() => setI(0)} disabled={i === 0}>
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>
    </DemoFrame>
  );
}
