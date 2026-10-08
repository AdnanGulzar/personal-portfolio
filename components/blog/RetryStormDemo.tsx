"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider } from "./DemoFrame";

// When the bottom service is down, every caller (the client app included) retries every failed call.
// Attempts multiply at each hop: (retries + 1) ^ services. This is exact, not a model.
export default function RetryStormDemo() {
  const [layers, setLayers] = useState(3);
  const [retries, setRetries] = useState(3);
  const perLayer = retries + 1;
  const hops = Array.from({ length: layers }, (_, i) => perLayer ** (i + 1));
  const total = hops.at(-1)!;
  const users = 1000;

  return (
    <DemoFrame title="How retries turn one failure into a storm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Services in the call chain" value={layers} min={1} max={5} onChange={setLayers} />
        <Slider label="Retries at each layer" value={retries} min={0} max={5} onChange={setRetries} />
      </div>

      <div className="mt-6 space-y-2">
        <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_5rem] items-center gap-3 text-xs">
          <span className="truncate text-muted" title="The app or browser retries too">User requests</span>
          <div className="h-5 rounded-md bg-white/[0.04]"><div className="h-full w-[2%] min-w-[3px] rounded-md bg-[#3b82f6]" /></div>
          <span className="text-right font-mono text-fg">{users.toLocaleString("en-GB")}</span>
        </div>
        {hops.map((h, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_5rem] items-center gap-3 text-xs">
            <span className="truncate text-muted">{i === layers - 1 ? "Failing service" : `Service ${String.fromCharCode(65 + i)}`}</span>
            <div className="h-5 rounded-md bg-white/[0.04]">
              <motion.div
                className="h-full min-w-[3px] rounded-md"
                initial={false}
                animate={{ width: `${Math.min((h / Math.max(total, 1)) * 100, 100)}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                style={{ background: i === layers - 1 ? "#ef4444" : "#f59e0b" }}
              />
            </div>
            <span className="text-right font-mono text-fg">{(users * h).toLocaleString("en-GB")}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Calls hitting the failing service</span>
        <span className="font-mono text-2xl" style={{ color: total > 10 ? "#ef4444" : "#ededed" }}>{total}×</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {retries === 0
          ? "No retries: each user request becomes exactly one call per layer. Failures surface quickly, but nothing recovers from a brief blip either."
          : `Every caller, starting with the user's app, makes ${perLayer} attempts, and every attempt below it does the same, so the struggling service gets ${perLayer}^${layers} = ${total} calls for every user request, at exactly the moment it can least handle them.`}
      </p>
    </DemoFrame>
  );
}
