"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

type Kind = "raw" | "debounce" | "throttle";
const rows: { kind: Kind; label: string; color: string; note: string }[] = [
  { kind: "raw", label: "Every keystroke", color: "#ef4444", note: "One API call per key" },
  { kind: "debounce", label: "Debounced", color: "#10b981", note: "Waits until you pause" },
  { kind: "throttle", label: "Throttled", color: "#3b82f6", note: "At most once per interval" },
];

export default function DebounceDemo() {
  const [wait, setWait] = useState(400);
  const [text, setText] = useState("");
  const [events, setEvents] = useState<{ id: number; kind: Kind }[]>([]);
  const id = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastThrottle = useRef(0);
  const trailing = useRef<ReturnType<typeof setTimeout>>(undefined);

  const push = (kind: Kind) => setEvents((e) => [...e.slice(-90), { id: id.current++, kind }]);

  useEffect(() => () => { clearTimeout(debounceTimer.current); clearTimeout(trailing.current); }, []);

  const onType = (v: string) => {
    setText(v);
    push("raw");

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => push("debounce"), wait);

    const now = Date.now();
    if (now - lastThrottle.current >= wait) {
      lastThrottle.current = now;
      push("throttle");
    } else {
      // trailing call so the final value isn't lost
      clearTimeout(trailing.current);
      trailing.current = setTimeout(() => { lastThrottle.current = Date.now(); push("throttle"); }, wait - (now - lastThrottle.current));
    }
  };

  const count = (k: Kind) => events.filter((e) => e.kind === k).length;

  return (
    <DemoFrame title="Debounce vs throttle: type fast in the search box">
      <div className="grid gap-4 sm:grid-cols-[1fr_200px] sm:items-end">
        <input
          value={text}
          onChange={(e) => onType(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-xl border border-line bg-black/60 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-white/40 focus:ring-4 focus:ring-white/5"
        />
        <Slider label="Wait" value={wait} min={100} max={1000} step={50} format={(v) => `${v} ms`} onChange={setWait} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.kind}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-fg">{r.label} <span className="text-subtle">· {r.note}</span></span>
              <span className="font-mono text-lg" style={{ color: r.color }}>{count(r.kind)}</span>
            </div>
            <div className="mt-1.5 flex h-5 items-center gap-1 overflow-hidden rounded-lg border border-line px-1.5">
              <AnimatePresence initial={false}>
                {events.filter((e) => e.kind === r.kind).slice(-40).map((e) => (
                  <motion.span
                    key={e.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => { setEvents([]); setText(""); }} className="mt-4 text-xs text-subtle underline-offset-4 transition hover:text-white hover:underline">
        Reset
      </button>
    </DemoFrame>
  );
}
