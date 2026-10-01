"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

// A deliberately simple capacity model — enough to show *why* each building block exists.
const SERVER_CAPACITY = 1500; // requests/sec one app server can handle
const DB_CAPACITY = 3000; // requests/sec the database can handle
const CACHE_HIT = 0.8; // share of reads served from cache

function simulate(rps: number, servers: number, cache: boolean) {
  const appLoad = rps / servers;
  const dbLoad = rps * (cache ? 1 - CACHE_HIT : 1);
  const uApp = appLoad / SERVER_CAPACITY;
  const uDb = dbLoad / DB_CAPACITY;
  // Queueing: latency explodes as utilisation approaches 100%
  const appMs = 20 / (1 - Math.min(uApp, 0.96));
  const dbMs = 30 / (1 - Math.min(uDb, 0.96));
  const dataMs = cache ? CACHE_HIT * 2 + (1 - CACHE_HIT) * dbMs : dbMs;
  const errApp = uApp > 1 ? (appLoad - SERVER_CAPACITY) / appLoad : 0;
  const errDb = uDb > 1 ? (dbLoad - DB_CAPACITY) / dbLoad : 0;
  return { uApp, uDb, latency: Math.round(appMs + dataMs), errors: Math.max(errApp, errDb) };
}

const loadColor = (u: number) => (u < 0.6 ? "#10b981" : u < 0.9 ? "#f59e0b" : "#ef4444");

function LoadBar({ u }: { u: number }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
      <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(u, 1) * 100}%`, backgroundColor: loadColor(u) }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
    </div>
  );
}

export default function ScalingSimulator() {
  const [rps, setRps] = useState(1200);
  const [servers, setServers] = useState(1);
  const [cache, setCache] = useState(false);
  const s = simulate(rps, servers, cache);

  const curve = useMemo(
    () => Array.from({ length: 41 }, (_, i) => {
      const r = i * 500;
      const p = simulate(Math.max(r, 1), servers, cache);
      return { rps: r, latency: p.errors > 0 ? null : p.latency };
    }),
    [servers, cache]
  );

  const status = s.errors > 0 ? { text: `${Math.round(s.errors * 100)}% of requests failing`, color: "#ef4444" }
    : s.latency > 200 ? { text: "Slow — users will notice", color: "#f59e0b" }
    : { text: "Healthy", color: "#10b981" };

  return (
    <DemoFrame title="Scale a web app: add servers, a load balancer and a cache">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Traffic" value={rps} min={100} max={20000} step={100} format={(v) => `${v.toLocaleString()} req/s`} onChange={setRps} />
          <Slider label="App servers" value={servers} min={1} max={8} format={(v) => `${v}${v > 1 ? " + load balancer" : ""}`} onChange={setServers} />
        </div>
        <Toggle label="Redis cache" on={cache} onChange={setCache} />
      </div>

      {/* Architecture diagram */}
      <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-line p-4 text-xs">
        <div className="rounded-xl border border-line px-3 py-2 text-center text-muted">Users</div>
        <div className="flex flex-wrap justify-center gap-2">
          {servers > 1 && <div className="w-full text-center font-mono text-[10px] uppercase tracking-widest text-[#a855f7]">↓ load balancer ↓</div>}
          {Array.from({ length: servers }, (_, i) => (
            <motion.div key={i} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="w-[72px] rounded-xl border border-line px-2 py-2">
              <div className="text-center text-fg">App {i + 1}</div>
              <LoadBar u={s.uApp} />
            </motion.div>
          ))}
        </div>
        <div className="space-y-2">
          {cache && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="w-[84px] rounded-xl border border-[#ef4444]/40 px-2 py-2 text-center text-fg">
              Cache <span className="block font-mono text-[10px] text-muted">{CACHE_HIT * 100}% hits</span>
            </motion.div>
          )}
          <div className="w-[84px] rounded-xl border border-line px-2 py-2">
            <div className="text-center text-fg">Database</div>
            <LoadBar u={s.uDb} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-line p-3">
          <div className="font-mono text-xl text-white">{s.errors > 0 ? "—" : `${s.latency}ms`}</div>
          <div className="text-[11px] text-subtle">Response time</div>
        </div>
        <div className="rounded-2xl border border-line p-3">
          <div className="font-mono text-xl text-white">{Math.round(Math.min(s.uDb, 9.99) * 100)}%</div>
          <div className="text-[11px] text-subtle">Database load</div>
        </div>
        <div className="rounded-2xl border p-3" style={{ borderColor: `${status.color}55` }}>
          <div className="text-sm font-medium" style={{ color: status.color }}>{status.text}</div>
          <div className="text-[11px] text-subtle">Status</div>
        </div>
      </div>

      <div className="mt-6 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="rps" tick={{ fill: "#6b6b6b", fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} stroke="rgba(255,255,255,0.1)" unit="ms" />
            <Tooltip
              contentStyle={{ background: "#0a1430", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, fontSize: 12 }}
              labelFormatter={(v) => `${Number(v).toLocaleString()} req/s`}
              formatter={(v) => [`${v}ms`, "Latency"]}
            />
            <ReferenceLine x={Math.round(rps / 500) * 500} stroke="#a855f7" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-1 text-center text-[11px] text-subtle">Latency vs traffic for this setup. The line stops where the system starts dropping requests.</p>
      </div>
    </DemoFrame>
  );
}
