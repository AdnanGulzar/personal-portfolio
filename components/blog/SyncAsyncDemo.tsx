"use client";
import { useState } from "react";
import DemoFrame from "./DemoFrame";

const SERVICES = [
  { id: "payment", name: "Take payment", svc: "payments", ms: 300, critical: true },
  { id: "stock", name: "Reserve stock", svc: "inventory", ms: 80, critical: true },
  { id: "email", name: "Send confirmation email", svc: "email", ms: 400, critical: false },
  { id: "analytics", name: "Record analytics", svc: "analytics", ms: 120, critical: false },
  { id: "recs", name: "Update recommendations", svc: "recommendations", ms: 250, critical: false },
];
const UPTIME = 0.999; // each service on its own
const PUBLISH_MS = 5; // writing a message to the queue
const TIMEOUT_MS = 2000;

// Checkout calls each service in turn. A synchronous call adds its latency and its chance of failing;
// a queued one costs a quick publish, and its work happens later, even if that service is down right now.
export default function SyncAsyncDemo() {
  const [queued, setQueued] = useState<Record<string, boolean>>({});
  const [down, setDown] = useState<string | null>(null);

  const sync = SERVICES.filter((s) => !queued[s.id]);
  const later = SERVICES.filter((s) => queued[s.id]);
  const syncDown = sync.find((s) => s.id === down);
  const ms = sync.reduce((t, s) => t + (s.id === down ? TIMEOUT_MS : s.ms), 0) + later.length * PUBLISH_MS;
  const uptime = UPTIME ** sync.length;
  const queuedCritical = later.filter((s) => s.critical);

  return (
    <DemoFrame title="Checkout: call it now, or put it on a queue?" hint="Click to change">
      <div className="space-y-2">
        {SERVICES.map((s) => {
          const q = !!queued[s.id], isDown = down === s.id;
          return (
            <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-xl border border-line px-3 py-2">
              <span className="min-w-0 text-sm text-fg">
                {s.name} <span className="font-mono text-xs text-subtle">{s.ms} ms</span>
              </span>
              <button type="button" aria-pressed={q} onClick={() => setQueued({ ...queued, [s.id]: !q })}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${q ? "border-[#10b981]/60 bg-[#10b981]/15 text-white" : "border-[#3b82f6]/60 bg-[#3b82f6]/15 text-white"}`}>
                {q ? "Queue" : "Call now"}
              </button>
              <button type="button" aria-pressed={isDown} onClick={() => setDown(isDown ? null : s.id)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${isDown ? "border-[#ef4444]/60 bg-[#ef4444]/15 text-white" : "border-line text-muted hover:text-white"}`}>
                {isDown ? "Down" : "Up"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted">User waits</p>
          <p className="font-mono text-xl" style={{ color: ms > 600 ? "#ef4444" : "#10b981" }}>{ms.toLocaleString("en-GB")} ms</p>
        </div>
        <div>
          <p className="text-xs text-muted">Checkout available</p>
          <p className="font-mono text-xl text-fg">{(uptime * 100).toFixed(2)}%</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-muted">Right now</p>
          <p className="font-mono text-xl" style={{ color: syncDown ? "#ef4444" : "#10b981" }}>{syncDown ? "500 error" : "Order placed"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {syncDown
          ? `The ${syncDown.svc} service is down and checkout waits on it, so after a ${TIMEOUT_MS / 1000} s timeout the whole order fails, even though ${syncDown.critical ? "this step really is needed" : "the customer didn't need this step to finish"}.`
          : down
            ? `The ${SERVICES.find((s) => s.id === down)!.svc} service is down, but its messages just wait in the queue and get processed when it recovers. The customer never notices.`
            : sync.length === 0
              ? "Nothing is called synchronously, so the order can't fail because a service is down. But the customer gets no answer about payment either."
              : `Each service is up ${(UPTIME * 100).toFixed(1)}% of the time on its own. Calling ${sync.length} in a row means all ${sync.length} must be up at once: ${UPTIME}^${sync.length} = ${(uptime * 100).toFixed(2)}%.`}
        {queuedCritical.length > 0 && ` Careful: the customer needs to know whether "${queuedCritical[0].name.toLowerCase()}" worked before you say "order placed". Queue it only if the UI can show a pending state.`}
      </p>
    </DemoFrame>
  );
}
