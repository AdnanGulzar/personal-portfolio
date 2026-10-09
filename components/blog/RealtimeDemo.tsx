"use client";
import { useMemo, useState } from "react";
import DemoFrame, { Slider } from "./DemoFrame";

const WINDOW = 60_000; // one minute
const EVENTS = [3_200, 4_000, 11_500, 12_100, 12_400, 12_480, 27_000, 41_300, 44_800, 52_600]; // when the server has news
const HOLD = 30_000; // long-poll timeout: the server answers empty after this long

type Method = "poll" | "long" | "sse" | "ws";
const METHODS: { id: Method; label: string }[] = [
  { id: "poll", label: "Polling" },
  { id: "long", label: "Long polling" },
  { id: "sse", label: "Server-Sent Events" },
  { id: "ws", label: "WebSocket" },
];

type Req = { sent: number; answered: number; got: number[] }; // got: events delivered in the response
type Result = { reqs: Req[]; delays: number[]; empty: number; requests: number };

// Each request reaches the server half a round trip after it's sent, and the answer
// reaches the browser half a round trip after the server sends it.
function simulate(method: Method, interval: number, rtt: number): Result {
  const half = rtt / 2;
  const delivered = new Array<number>(EVENTS.length);
  const reqs: Req[] = [];

  if (method === "sse" || method === "ws") {
    // one long-lived connection; each event is pushed the moment it happens
    EVENTS.forEach((e, i) => (delivered[i] = e + half));
    return { reqs: [], delays: EVENTS.map((e, i) => delivered[i] - e), empty: 0, requests: 1 };
  }

  let next = 0; // index of the first event not yet delivered
  let sent = 0;
  while (next < EVENTS.length) {
    const arrive = sent + half;
    let respond = arrive;
    if (method === "long" && !(EVENTS[next] <= arrive)) respond = Math.min(EVENTS[next], arrive + HOLD); // hold the request open
    const got: number[] = [];
    while (next < EVENTS.length && EVENTS[next] <= respond) { delivered[next] = respond + half; got.push(next++); }
    reqs.push({ sent, answered: respond + half, got });
    sent = method === "poll" ? sent + interval : respond + half; // long polling asks again straight away
  }
  const inWindow = reqs.filter((r) => r.sent < WINDOW);
  return { reqs, delays: EVENTS.map((e, i) => delivered[i] - e), empty: inWindow.filter((r) => r.got.length === 0).length, requests: inWindow.length };
}

const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`);

export default function RealtimeDemo() {
  const [method, setMethod] = useState<Method>("poll");
  const [interval, setPollMs] = useState(5_000);
  const [rtt, setRtt] = useState(100);
  const all = useMemo(() => Object.fromEntries(METHODS.map((m) => [m.id, simulate(m.id, interval, rtt)])) as Record<Method, Result>, [interval, rtt]);
  const r = all[method];
  const pct = (t: number) => `${(Math.min(t, WINDOW) / WINDOW) * 100}%`;
  const avg = (d: number[]) => d.reduce((s, x) => s + x, 0) / d.length;

  return (
    <DemoFrame title="One minute of updates, four ways" hint={`${EVENTS.length} events`}>
      <div className="flex flex-wrap gap-2">
        {METHODS.map((m) => (
          <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${method === m.id ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Polling interval" value={interval} min={1_000} max={20_000} step={1_000} format={fmt} onChange={setPollMs} />
        <Slider label="Round trip to the server" value={rtt} min={20} max={400} step={10} format={fmt} onChange={setRtt} />
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Server has news</p>
      <div className="relative mt-2 h-4">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
        {EVENTS.map((e) => <span key={e} className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]" style={{ left: pct(e) }} />)}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        {method === "sse" || method === "ws" ? "One open connection, events pushed down it" : "HTTP requests (green: brought news, grey: empty)"}
      </p>
      <div className="relative mt-2 h-6 overflow-hidden rounded-md bg-white/[0.04]">
        {method === "sse" || method === "ws" ? (
          <>
            <span className="absolute inset-y-0 left-0 right-0 bg-[#a855f7]/25" />
            {EVENTS.map((e) => <span key={e} className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#10b981]" style={{ left: pct(e + rtt / 2) }} />)}
          </>
        ) : (
          r.reqs.filter((q) => q.sent < WINDOW).map((q, i) => (
            <span key={i} className="absolute inset-y-1 min-w-[2px] rounded-sm"
              style={{ left: pct(q.sent), width: `${(Math.min(q.answered, WINDOW) - q.sent) / WINDOW * 100}%`, background: q.got.length ? "#10b981" : "rgba(255,255,255,0.3)", borderRight: "1px solid rgba(0,0,0,0.7)" }} />
          ))
        )}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-subtle">
              <th className="border-b border-line px-3 py-2 font-medium">Method</th>
              <th className="border-b border-line px-3 py-2 font-medium">Requests</th>
              <th className="border-b border-line px-3 py-2 font-medium">Empty</th>
              <th className="border-b border-line px-3 py-2 font-medium">Avg delay</th>
              <th className="border-b border-line px-3 py-2 font-medium">Worst</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {METHODS.map((m) => {
              const x = all[m.id];
              return (
                <tr key={m.id} className={m.id === method ? "bg-white/[0.04]" : ""}>
                  <td className="border-b border-line px-3 py-1.5 font-sans text-fg">{m.label}</td>
                  <td className="border-b border-line px-3 py-1.5 text-muted">{x.requests}</td>
                  <td className="border-b border-line px-3 py-1.5" style={{ color: x.empty ? "#ef4444" : "#10b981" }}>{x.empty}</td>
                  <td className="border-b border-line px-3 py-1.5 text-muted">{fmt(avg(x.delays))}</td>
                  <td className="border-b border-line px-3 py-1.5 text-muted">{fmt(Math.max(...x.delays))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {method === "poll" && `Every ${fmt(interval)} the browser asks "anything new?". ${r.empty} of ${r.requests} answers are empty, and news waits up to a whole interval before anyone asks for it. Shorter intervals cut the delay but multiply the empty requests.`}
        {method === "long" && `The server holds each request open until it has news (or ${HOLD / 1000} s pass), then the browser immediately asks again. Delay drops to about half a round trip, except for news that arrives while the next request is still on its way: it waits for that request to land.`}
        {method === "sse" && "One HTTP response that never ends: the server writes each event into it as it happens. Delay is half a round trip, there are no empty requests, and the browser reconnects automatically if the connection drops. Server to browser only."}
        {method === "ws" && "The same push delay as SSE over one upgraded connection, but it's two-way: the browser can send messages up the same socket without making new HTTP requests. You handle reconnecting and heartbeats yourself."}
      </p>
    </DemoFrame>
  );
}
