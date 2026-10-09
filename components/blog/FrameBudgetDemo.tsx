"use client";
import { useMemo, useState } from "react";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

const WINDOW = 500; // ms shown
const RENDER_MS = 3; // style + layout + paint record per frame, on top of your JavaScript
const LONG_TASK = { start: 150, ms: 120 };

// The main thread starts a frame's work on a display refresh (vsync), once it's free. Each refresh shows
// a new frame only if some frame's work finished since the previous refresh; otherwise the old frame repeats.
function simulate(hz: number, jsMs: number, longTask: boolean) {
  const budget = 1000 / hz;
  const nextVsync = (t: number) => Math.ceil(t / budget - 1e-9) * budget;
  const work: { start: number; end: number; long?: boolean }[] = [];
  let mainFree = 0;
  let longDone = !longTask;
  for (;;) {
    const start = nextVsync(mainFree);
    if (start >= WINDOW) break;
    if (!longDone && start >= LONG_TASK.start) {
      // the click handler was queued first, so it runs before the next frame can start
      const s = Math.max(LONG_TASK.start, mainFree);
      work.push({ start: s, end: s + LONG_TASK.ms, long: true });
      mainFree = s + LONG_TASK.ms;
      longDone = true;
      continue;
    }
    const end = start + jsMs + RENDER_MS;
    work.push({ start, end });
    mainFree = end;
  }
  const frames = Array.from({ length: Math.round(WINDOW / budget) }, (_, k) =>
    work.some((w) => !w.long && w.end > k * budget && w.end <= (k + 1) * budget));
  return { budget, frames, work };
}

export default function FrameBudgetDemo() {
  const [hz, setHz] = useState(60);
  const [jsMs, setJsMs] = useState(6);
  const [longTask, setLongTask] = useState(false);
  const { budget, frames, work } = useMemo(() => simulate(hz, jsMs, longTask), [hz, jsMs, longTask]);
  const ok = frames.filter(Boolean).length;
  const fps = Math.round((ok / WINDOW) * 1000);

  return (
    <DemoFrame title="The frame budget" hint={`${budget.toFixed(1)} ms per frame`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="JavaScript per frame" value={jsMs} min={0} max={30} format={(v) => `${v} ms`} onChange={setJsMs} />
        <div className="flex flex-wrap items-end gap-2">
          {[60, 120].map((h) => (
            <button key={h} type="button" aria-pressed={hz === h} onClick={() => setHz(h)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${hz === h ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}>
              {h} Hz screen
            </button>
          ))}
          <Toggle label={`A ${LONG_TASK.ms} ms click handler`} on={longTask} onChange={setLongTask} />
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Main thread, first {WINDOW} ms</p>
      <div className="relative mt-2 h-6 overflow-hidden rounded-md bg-white/[0.04]">
        {work.map((w, i) => (
          <span key={i} className="absolute inset-y-0" style={{ left: `${(w.start / WINDOW) * 100}%`, width: `${(Math.min(w.end, WINDOW) - w.start) / WINDOW * 100}%`, background: w.long ? "#ef4444" : "#a855f7", opacity: w.long ? 0.9 : 0.75, borderRight: "1px solid rgba(0,0,0,0.6)" }} />
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Screen refreshes</p>
      <div className="mt-2 flex gap-[2px]">
        {frames.map((f, i) => (
          <span key={i} className="h-6 flex-1 rounded-[2px]" style={{ background: f ? "#10b981" : "#ef4444", opacity: f ? 0.8 : 0.9 }} title={f ? "new frame" : "dropped: old frame shown again"} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Frames delivered</span>
        <span className="font-mono text-2xl" style={{ color: ok === frames.length ? "#10b981" : "#ef4444" }}>{ok}/{frames.length} · {fps} fps</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {jsMs + RENDER_MS > budget
          ? `Your ${jsMs} ms of JavaScript plus about ${RENDER_MS} ms of rendering doesn't fit in a ${budget.toFixed(1)} ms frame, so each frame spills into the next refresh and the screen only gets a new frame every other refresh (or less), even without anything else going on.`
          : longTask
          ? `Every frame fits, until the click handler runs. For ${LONG_TASK.ms} ms nothing else can use the main thread, so the screen keeps showing the same frame: that's jank.`
          : `${jsMs} ms of JavaScript plus about ${RENDER_MS} ms of rendering fits inside each ${budget.toFixed(1)} ms frame.`}
      </p>
    </DemoFrame>
  );
}
