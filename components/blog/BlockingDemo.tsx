"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

type Kind = "cpu" | "io" | "worker" | "wait";
type Seg = { kind: Exclude<Kind, "wait">; ms: number };
type Bar = { kind: Kind; start: number; end: number };

const colors: Record<Kind, string> = { cpu: "#a855f7", io: "#3b82f6", worker: "#f59e0b", wait: "#ef4444" };
const legend: [Kind, string][] = [["cpu", "JS on main thread"], ["io", "Waiting on I/O (off-thread)"], ["worker", "Worker thread"], ["wait", "Queued, main thread busy"]];

const modes = [
  { key: "io", label: "Heavy work is async I/O" },
  { key: "sync", label: "Heavy work is sync CPU" },
  { key: "worker", label: "CPU work in a worker" },
] as const;
type Mode = (typeof modes)[number]["key"];

// One main thread runs every CPU segment, first come first served.
// I/O and worker segments run elsewhere and don't hold the main thread.
function simulate(mode: Mode, heavyMs: number) {
  const heavy: Seg[] =
    mode === "sync" ? [{ kind: "cpu", ms: heavyMs }]
    : [{ kind: "cpu", ms: 5 }, { kind: mode === "io" ? "io" : "worker", ms: heavyMs }, { kind: "cpu", ms: 5 }];
  const reqs = [
    { name: "/report (heavy)", arrive: 0, segs: heavy },
    ...[1, 2, 3, 4].map((n) => ({ name: `/user/${n}`, arrive: n * 60, segs: [{ kind: "cpu", ms: 5 }, { kind: "io", ms: 40 }, { kind: "cpu", ms: 5 }] as Seg[] })),
  ];
  const st = reqs.map((r) => ({ ...r, i: 0, ready: r.arrive, bars: [] as Bar[], done: 0 }));
  let mainFree = 0;
  for (;;) {
    const next = st.filter((r) => r.i < r.segs.length).sort((a, b) => a.ready - b.ready)[0];
    if (!next) break;
    const seg = next.segs[next.i];
    const start = Math.max(mainFree, next.ready);
    if (start > next.ready) next.bars.push({ kind: "wait", start: next.ready, end: start });
    next.bars.push({ kind: "cpu", start, end: start + seg.ms });
    mainFree = next.ready = start + seg.ms;
    next.i++;
    // off-thread segments start straight away and don't block anyone
    while (next.i < next.segs.length && next.segs[next.i].kind !== "cpu") {
      const s = next.segs[next.i++];
      next.bars.push({ kind: s.kind, start: next.ready, end: next.ready + s.ms });
      next.ready += s.ms;
    }
    next.done = next.ready;
  }
  return st.map((r) => ({ name: r.name, arrive: r.arrive, bars: r.bars, total: r.done - r.arrive }));
}

export default function BlockingDemo() {
  const [mode, setMode] = useState<Mode>("sync");
  const [heavyMs, setHeavyMs] = useState(600);
  const rows = useMemo(() => simulate(mode, heavyMs), [mode, heavyMs]);
  const end = Math.max(...rows.flatMap((r) => r.bars.map((b) => b.end)), 1);
  const others = rows.slice(1);
  const avg = Math.round(others.reduce((n, r) => n + r.total, 0) / others.length);

  return (
    <DemoFrame title="One slow request, five users, one thread">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={m.key === mode}
            onClick={() => setMode(m.key)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${m.key === mode ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-4 max-w-sm">
        <Slider label="Heavy request duration" value={heavyMs} min={100} max={1500} step={50} format={(v) => `${v} ms`} onChange={setHeavyMs} />
      </div>

      <div className="mt-6 space-y-2.5">
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs sm:grid-cols-[8.5rem_minmax(0,1fr)_4rem]">
            <span className="truncate font-mono text-muted">{r.name}</span>
            <div className="relative h-6 rounded-md bg-white/[0.04]">
              {r.bars.map((b, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={{ left: `${(b.start / end) * 100}%`, width: `${((b.end - b.start) / end) * 100}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  className="absolute inset-y-0 min-w-[2px] rounded-sm"
                  style={{ background: b.kind === "wait" ? `repeating-linear-gradient(45deg, ${colors.wait}66 0 4px, transparent 4px 8px)` : colors[b.kind] }}
                />
              ))}
            </div>
            <span className="text-right font-mono text-fg">{r.total} ms</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {legend.map(([k, l]) => (
          <span key={k} className="inline-flex items-center gap-1.5 text-[11px] text-subtle">
            <span className="size-2.5 rounded-sm" style={{ background: colors[k] }} />
            {l}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Average response for the other four users</span>
        <span className="font-mono text-2xl" style={{ color: avg > 200 ? "#ef4444" : "#10b981" }}>{avg} ms</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        Each normal request needs about 10 ms of JavaScript and a 40 ms database call, so on its own it takes about 50 ms.
      </p>
    </DemoFrame>
  );
}
