"use client";
import { useRef, useState } from "react";
import DemoFrame from "./DemoFrame";

const btn = "rounded-xl border border-line px-3 py-2 text-left font-mono text-xs text-muted transition hover:border-line-strong hover:text-white";

export default function StateSnapshotDemo() {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<{ label: string; from: number } | null>(null);
  const renders = useRef(0);
  const rendersAtClick = useRef(0);
  renders.current += 1;

  const click = (label: string, update: () => void) => {
    rendersAtClick.current = renders.current;
    setLast({ label, from: count });
    update();
  };

  return (
    <DemoFrame title="State is a snapshot: both buttons call setCount three times">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">count</p>
          <p className="text-5xl font-semibold tabular-nums text-white">{count}</p>
        </div>
        <div className="grid flex-1 gap-2 sm:min-w-64">
          <button
            type="button"
            className={btn}
            onClick={() => click("count + 1", () => { setCount(count + 1); setCount(count + 1); setCount(count + 1); })}
          >
            setCount(count + 1) ×3
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => click("c => c + 1", () => { setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1); })}
          >
            setCount(c =&gt; c + 1) ×3
          </button>
          <button type="button" className={btn} onClick={() => { setCount(0); setLast(null); }}>
            reset
          </button>
        </div>
      </div>
      <p className="mt-5 min-h-10 text-xs leading-relaxed text-subtle">
        {!last
          ? "Click a button. Each one queues three updates in a single event handler."
          : last.label === "count + 1"
            ? `count went from ${last.from} to ${count}, not ${last.from + 3}. During this render count was ${last.from}, so all three calls asked for ${last.from + 1}. React batched them into ${renders.current - rendersAtClick.current} render.`
            : `count went from ${last.from} to ${count}. Updater functions receive the latest queued value, so they stack. Still only ${renders.current - rendersAtClick.current} render, thanks to batching.`}
      </p>
    </DemoFrame>
  );
}
