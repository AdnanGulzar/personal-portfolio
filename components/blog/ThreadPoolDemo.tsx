"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

const HASH_MS = 100; // one crypto.pbkdf2 call
const FS_MS = 5;     // one fs.readFile call
const NET_MS = 30;   // one HTTP request: kernel-watched socket, never in the pool

type Bar = { kind: "wait" | "pool" | "net"; start: number; end: number };
const colors = { wait: "#ef4444", pool: "#f59e0b", net: "#3b82f6" };

// Everything starts at 0 ms, queued in this order; each job takes the earliest free pool thread.
function simulate(hashes: number, threads: number) {
  const free = Array(threads).fill(0);
  const jobs = [
    ...Array.from({ length: hashes }, (_, i) => ({ name: `pbkdf2 #${i + 1}`, arrive: 0, ms: HASH_MS, pool: true })),
    { name: "fs.readFile", arrive: 0, ms: FS_MS, pool: true },
    { name: "HTTP request", arrive: 0, ms: NET_MS, pool: false },
  ];
  return jobs.map((j) => {
    if (!j.pool) return { ...j, thread: null as number | null, bars: [{ kind: "net", start: j.arrive, end: j.arrive + j.ms }] as Bar[], done: j.arrive + j.ms };
    const t = free.indexOf(Math.min(...free));
    const start = Math.max(free[t], j.arrive);
    free[t] = start + j.ms;
    const bars: Bar[] = [];
    if (start > j.arrive) bars.push({ kind: "wait", start: j.arrive, end: start });
    bars.push({ kind: "pool", start, end: start + j.ms });
    return { ...j, thread: t + 1, bars, done: start + j.ms };
  });
}

export default function ThreadPoolDemo() {
  const [hashes, setHashes] = useState(5);
  const [threads, setThreads] = useState(4);
  const rows = useMemo(() => simulate(hashes, threads), [hashes, threads]);
  const end = Math.max(...rows.map((r) => r.done));
  const fs = rows.find((r) => r.name === "fs.readFile")!;

  return (
    <DemoFrame title="Who's waiting for the thread pool?">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Passwords hashed at once" value={hashes} min={1} max={10} onChange={setHashes} />
        <Slider label="UV_THREADPOOL_SIZE" value={threads} min={1} max={8} format={(v) => `${v} thread${v > 1 ? "s" : ""}${v === 4 ? " (default)" : ""}`} onChange={setThreads} />
      </div>

      <div className="mt-6 space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs sm:grid-cols-[8rem_minmax(0,1fr)_4.5rem]">
            <span className={`truncate font-mono ${r.pool ? "text-muted" : "text-[#93c5fd]"}`}>{r.name}</span>
            <div className="relative h-5 rounded-md bg-white/[0.04]">
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
              {/* thread label only when the bar is wide enough to hold it */}
              {r.thread && (r.bars.at(-1)!.end - r.bars.at(-1)!.start) / end > 0.08 && (
                <span className="absolute inset-y-0 flex items-center pl-1.5 font-mono text-[10px] text-black/70" style={{ left: `${(r.bars.at(-1)!.start / end) * 100}%` }}>
                  T{r.thread}
                </span>
              )}
            </div>
            <span className="text-right font-mono text-fg">{r.done} ms</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-subtle">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: colors.pool }} />Running on pool thread (T1, T2…)</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: colors.wait }} />Queued for a free thread</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: colors.net }} />Socket watched by the OS (no pool)</span>
      </div>

      <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-muted">
        {fs.bars.length > 1
          ? <>The 5 ms file read waited <span className="font-mono text-[#ef4444]">{fs.done - fs.arrive - FS_MS} ms</span> behind password hashing. The HTTP request didn&apos;t notice anything: sockets never use the pool.</>
          : <>Every job got a thread straight away, so the file read took just its own 5 ms. The HTTP request never needed the pool anyway.</>}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        Simplified: assumes each thread has its own CPU core. More pool threads than cores just makes them share CPUs, so raising the size only helps up to roughly your core count for CPU work like hashing.
      </p>
    </DemoFrame>
  );
}
