"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

// Deliberately simple model: each handshake costs whole round trips (RTT), which is
// what dominates on real networks. Download time and packet loss are left out.
function phases(rtt: number, server: number, dnsCached: boolean, reuse: boolean, http3: boolean) {
  const connect = reuse ? [] : http3
    ? [{ key: "quic", label: "QUIC + TLS 1.3", ms: rtt, color: "#a855f7" }]
    : [
        { key: "tcp", label: "TCP handshake", ms: rtt, color: "#3b82f6" },
        { key: "tls", label: "TLS 1.3 handshake", ms: rtt, color: "#a855f7" },
      ];
  return [
    { key: "dns", label: "DNS lookup", ms: dnsCached ? 0 : rtt, color: "#06b6d4" },
    ...connect,
    { key: "req", label: "Request → first byte", ms: rtt + server, color: "#10b981" },
  ].filter((p) => p.ms > 0);
}

export default function RequestWaterfall() {
  const [rtt, setRtt] = useState(80);
  const [server, setServer] = useState(100);
  const [dnsCached, setDnsCached] = useState(false);
  const [reuse, setReuse] = useState(false);
  const [http3, setHttp3] = useState(false);

  const ps = phases(rtt, server, dnsCached, reuse, http3);
  const total = ps.reduce((n, p) => n + p.ms, 0);
  // fixed-ish scale so bars visibly shrink when you turn things on
  const scale = Math.max(4 * rtt + server, 1);
  let start = 0;

  return (
    <DemoFrame title="Time to first byte, round trip by round trip">
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Round-trip time (distance to server)" value={rtt} min={10} max={300} step={5} format={(v) => `${v} ms`} onChange={setRtt} />
        <Slider label="Server think time" value={server} min={0} max={500} step={10} format={(v) => `${v} ms`} onChange={setServer} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Toggle label="DNS cached" on={dnsCached} onChange={setDnsCached} />
        <Toggle label="Connection already open" on={reuse} onChange={setReuse} />
        <Toggle label="HTTP/3 (QUIC)" on={http3} onChange={setHttp3} />
      </div>

      <div className="mt-6 space-y-2.5">
        {ps.map((p) => {
          const left = (start / scale) * 100;
          start += p.ms;
          return (
            <div key={p.key} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-center gap-3 text-xs sm:grid-cols-[10rem_minmax(0,1fr)]">
              <span className="truncate text-muted">{p.label}</span>
              <div className="relative h-6 rounded-md bg-white/[0.04]">
                <motion.div
                  className="absolute inset-y-0 rounded-md"
                  initial={false}
                  animate={{ left: `${left}%`, width: `${(p.ms / scale) * 100}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  style={{ background: `${p.color}55`, border: `1px solid ${p.color}` }}
                />
                <span className="absolute inset-y-0 right-2 flex items-center font-mono text-[10px] text-subtle">{p.ms} ms</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">First byte of HTML arrives after</span>
        <span className="font-mono text-2xl text-white">{total} ms</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        {Math.round(((total - server) / Math.max(total, 1)) * 100)}% of that is waiting on the network, not the server.
      </p>
    </DemoFrame>
  );
}
