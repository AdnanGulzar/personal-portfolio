"use client";
import { useMemo, useState } from "react";
import DemoFrame, { Slider } from "./DemoFrame";

const REQUESTS = [5, 25, 50, 70, 72, 95, 130, 150, 170]; // seconds after the deploy
const REGEN = 2; // seconds to regenerate a page in the background
const END = 180;

type Row = { t: number; served: number; status: "HIT" | "STALE"; regen: boolean; outdated: boolean };

// Stale-while-revalidate: once the cached page is older than `revalidate`, the next request
// still gets the cached copy, and triggers a background rebuild for everyone after it.
function simulate(revalidate: number, priceChangeAt: number) {
  const price = (t: number) => (t >= priceChangeAt ? 129 : 99);
  let builtAt = 0, cached = price(0), pending: { ready: number; value: number } | null = null;
  const rows: Row[] = [];
  for (const t of REQUESTS) {
    if (pending && t >= pending.ready) { cached = pending.value; builtAt = pending.ready; pending = null; }
    const stale = t - builtAt >= revalidate;
    const regen = stale && !pending;
    if (regen) pending = { ready: t + REGEN, value: price(t) };
    rows.push({ t, served: cached, status: stale ? "STALE" : "HIT", regen, outdated: cached !== price(t) });
  }
  return rows;
}

export default function ISRDemo() {
  const [revalidate, setRevalidate] = useState(60);
  const [change, setChange] = useState(40);
  const rows = useMemo(() => simulate(revalidate, change), [revalidate, change]);
  const outdated = rows.filter((r) => r.outdated).length;

  return (
    <DemoFrame title="ISR: who sees the old price?" hint="revalidate">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="export const revalidate" value={revalidate} min={10} max={120} step={5} format={(v) => `${v} s`} onChange={setRevalidate} />
        <Slider label="Price changes from £99 to £129 at" value={change} min={0} max={160} step={5} format={(v) => `${v} s`} onChange={setChange} />
      </div>

      {/* timeline */}
      <div className="relative mt-8 h-10">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <div className="absolute top-0 bottom-0 w-px bg-[#f59e0b]" style={{ left: `${(change / END) * 100}%` }}>
          <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-[#f59e0b]">price change</span>
        </div>
        {rows.map((r) => (
          <span
            key={r.t}
            title={`${r.t}s: served £${r.served}`}
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{ left: `${(r.t / END) * 100}%`, borderColor: r.outdated ? "#ef4444" : "#10b981", background: r.regen ? (r.outdated ? "#ef4444" : "#10b981") : "transparent" }}
          />
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-subtle">
              <th className="border-b border-line px-3 py-2 font-medium">Request at</th>
              <th className="border-b border-line px-3 py-2 font-medium">Cache</th>
              <th className="border-b border-line px-3 py-2 font-medium">Sees</th>
              <th className="border-b border-line px-3 py-2 font-medium">Background</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((r) => (
              <tr key={r.t}>
                <td className="border-b border-line px-3 py-1.5 text-muted">{r.t} s</td>
                <td className="border-b border-line px-3 py-1.5" style={{ color: r.status === "HIT" ? "#10b981" : "#f59e0b" }}>{r.status}</td>
                <td className="border-b border-line px-3 py-1.5" style={{ color: r.outdated ? "#ef4444" : "#ededed" }}>£{r.served}{r.outdated ? " (old)" : ""}</td>
                <td className="border-b border-line px-3 py-1.5 text-subtle">{r.regen ? "regenerate" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        <span className="font-mono" style={{ color: outdated ? "#ef4444" : "#10b981" }}>{outdated}</span> of {rows.length} visitors saw an out-of-date price.
        A STALE request is still served instantly from the cache; it just kicks off a rebuild, so the visitor after it gets the new page.
        For changes that must show up immediately, call <code className="font-mono text-fg">revalidatePath()</code> when the data changes instead of waiting for the timer.
      </p>
    </DemoFrame>
  );
}
