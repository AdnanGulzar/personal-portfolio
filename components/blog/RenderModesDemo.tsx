"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame from "./DemoFrame";

// Illustrative timings (ms) for one page load. CDN edge is close; the origin server is further away.
const CDN = 30, ORIGIN = 100, DATA = 300, RENDER = 50, JS = 200;

type Mark = { label: string; at: number; color: string };
const modes: Record<string, { name: string; marks: Mark[]; facts: [string, string][]; note: string }> = {
  ssg: {
    name: "SSG",
    marks: [
      { label: "HTML arrives", at: CDN, color: "#3b82f6" },
      { label: "Content visible", at: CDN + 20, color: "#10b981" },
      { label: "Interactive", at: CDN + 20 + JS, color: "#a855f7" },
    ],
    facts: [["HTML rendered", "Once, at build time"], ["Data freshness", "As of the last deploy"], ["Server work per request", "None, served from a CDN"]],
    note: "The HTML already exists, so a CDN near the user sends it immediately. The fastest option, but the page only changes when you rebuild.",
  },
  isr: {
    name: "ISR",
    marks: [
      { label: "HTML arrives", at: CDN, color: "#3b82f6" },
      { label: "Content visible", at: CDN + 20, color: "#10b981" },
      { label: "Interactive", at: CDN + 20 + JS, color: "#a855f7" },
    ],
    facts: [["HTML rendered", "At build, then again in the background"], ["Data freshness", "At most `revalidate` seconds old"], ["Server work per request", "Only when a page is regenerated"]],
    note: "Loads exactly like SSG, from the cache. Once the page is older than its revalidate time, the next visitor still gets the cached copy while Next.js rebuilds it in the background.",
  },
  ssr: {
    name: "SSR",
    marks: [
      { label: "HTML arrives", at: ORIGIN + DATA + RENDER, color: "#3b82f6" },
      { label: "Content visible", at: ORIGIN + DATA + RENDER + 20, color: "#10b981" },
      { label: "Interactive", at: ORIGIN + DATA + RENDER + 20 + JS, color: "#a855f7" },
    ],
    facts: [["HTML rendered", "On every request"], ["Data freshness", "Always current"], ["Server work per request", "Fetch data and render, every time"]],
    note: "The server fetches data and renders before it sends a single byte, so the user stares at a blank tab for the whole data fetch. Needed for per-user or real-time pages.",
  },
  stream: {
    name: "Streaming",
    marks: [
      { label: "HTML arrives", at: ORIGIN + 20, color: "#3b82f6" },
      { label: "Shell visible", at: ORIGIN + 40, color: "#10b981" },
      { label: "Slow part streams in", at: ORIGIN + DATA + RENDER, color: "#f59e0b" },
      { label: "Interactive", at: ORIGIN + DATA + RENDER + JS, color: "#a855f7" },
    ],
    facts: [["HTML rendered", "On every request, in chunks"], ["Data freshness", "Always current"], ["Server work per request", "Same as SSR, but sent sooner"]],
    note: "Still rendered per request, but the server sends the layout and loading states straight away, then streams each slow section into the same response as its data arrives.",
  },
  ppr: {
    name: "PPR",
    marks: [
      { label: "HTML arrives", at: CDN, color: "#3b82f6" },
      { label: "Shell visible", at: CDN + 20, color: "#10b981" },
      { label: "Shell interactive", at: CDN + 20 + JS, color: "#a855f7" },
      { label: "Dynamic part streams in", at: ORIGIN + DATA + RENDER, color: "#f59e0b" },
    ],
    facts: [["HTML rendered", "Shell at build time, holes per request"], ["Data freshness", "Shell per cacheLife, holes always current"], ["Server work per request", "Only the dynamic holes"]],
    note: "The static shell (layout, cached content and loading fallbacks) arrives as fast as SSG. Meanwhile the server renders only the per-request parts, like the cart, and streams them into the same response.",
  },
  csr: {
    name: "Client-side",
    marks: [
      { label: "HTML arrives", at: CDN, color: "#3b82f6" },
      { label: "JS loaded", at: CDN + JS, color: "#a855f7" },
      { label: "Content visible", at: CDN + JS + ORIGIN + DATA, color: "#10b981" },
    ],
    facts: [["HTML rendered", "In the browser"], ["Data freshness", "Always current"], ["Server work per request", "Just the API call"]],
    note: "For contrast: an empty HTML shell arrives fast, but nothing useful appears until the JavaScript downloads, runs and then fetches the data. Search engines and slow phones see the empty shell longest.",
  },
};

export default function RenderModesDemo() {
  const [k, setK] = useState<keyof typeof modes>("ssg");
  const m = modes[k];
  const scale = 900; // fixed axis so modes compare fairly

  return (
    <DemoFrame title="Same page, six ways to render it" hint="Illustrative timings">
      <div role="tablist" aria-label="Rendering mode" className="flex flex-wrap gap-2">
        {Object.entries(modes).map(([key, v]) => (
          <button
            key={key}
            role="tab"
            aria-selected={key === k}
            type="button"
            onClick={() => setK(key)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${key === k ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}
          >
            {v.name}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {m.marks.map((mk) => (
          <div key={mk.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs sm:grid-cols-[9rem_minmax(0,1fr)_4rem]">
            <span className="truncate text-muted">{mk.label}</span>
            <div className="relative h-5 rounded-md bg-white/[0.04]">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-md"
                initial={false}
                animate={{ width: `${(mk.at / scale) * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                style={{ background: `${mk.color}88`, borderRight: `2px solid ${mk.color}` }}
              />
            </div>
            <span className="text-right font-mono text-fg">{mk.at} ms</span>
          </div>
        ))}
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {m.facts.map(([dt, dd]) => (
          <div key={dt} className="rounded-xl border border-line p-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-subtle">{dt}</dt>
            <dd className="mt-1 text-sm text-fg">{dd}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 min-h-16 text-sm leading-relaxed text-muted">{m.note}</p>
      <p className="mt-1 text-xs text-subtle">Assumes a CDN {CDN} ms away, an origin server {ORIGIN} ms away, a {DATA} ms database query and {JS} ms to load and run the JavaScript.</p>
    </DemoFrame>
  );
}
