"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame, { Toggle } from "./DemoFrame";

type Needs = { seo: boolean; personal: boolean; fresh: boolean; interactive: boolean; server: boolean };

const questions: { key: keyof Needs; label: string }[] = [
  { key: "seo", label: "Search engines and link previews matter" },
  { key: "personal", label: "Content differs per user" },
  { key: "fresh", label: "Data changes every few minutes" },
  { key: "interactive", label: "App-like, heavy interaction" },
  { key: "server", label: "I can run servers (not just static hosting)" },
];

// Each technique scores itself against the requirements and explains why. Opinionated, but each rule is a real trade-off.
const techniques: { name: string; rate: (n: Needs) => [number, string] }[] = [
  { name: "Static site generation (SSG)", rate: (n) =>
    n.personal ? [-2, "Pages are built once for everyone, so per-user content would need client-side fetching."]
    : n.fresh ? [0, "Fast and cheap, but every change needs a rebuild."]
    : [3, "Same content for everyone and rarely changes: prebuilt HTML on a CDN is the fastest, cheapest option."] },
  { name: "Incremental static regeneration (ISR)", rate: (n) =>
    !n.server ? [-3, "Needs a server or a platform to regenerate pages."]
    : n.personal ? [-1, "Cached pages are shared, so per-user parts would still need another technique."]
    : n.interactive && !n.seo ? [0, "Possible, but an interactive app that doesn't need SEO gains little from cached HTML."]
    : n.fresh ? [3, "Static speed, refreshed in the background or on demand when data changes."]
    : [1, "Works, but plain SSG is simpler if content rarely changes."] },
  { name: "Server-side rendering (SSR)", rate: (n) =>
    !n.server ? [-3, "Needs a server for every request."]
    : n.personal && n.seo ? [2, "Fresh, personalised HTML that crawlers can read. Add streaming if data is slow."]
    : n.personal || n.fresh ? [1, "Always fresh, at the cost of server work on every request."]
    : [-1, "Rendering the same page on every request wastes server time; cache it instead."] },
  { name: "Partial prerendering / streaming", rate: (n) =>
    !n.server ? [-3, "The dynamic parts need a server at request time."]
    : n.personal && n.seo ? [3, "A static shell for everyone, with only the personal parts rendered per request."]
    : n.personal || n.fresh ? [2, "Static where possible, live where needed, without slowing the whole page."]
    : [0, "Little to gain when nothing on the page is dynamic."] },
  { name: "Client-side rendering (SPA)", rate: (n) =>
    n.seo ? [-2, "Crawlers and link-preview bots may see an empty page, and the first load is slowest."]
    : n.interactive ? [3, "Behind a login and highly interactive: a SPA is simple to host and fast once loaded."]
    : [0, "Possible, but you pay the JavaScript cost without needing it."] },
  { name: "Islands architecture", rate: (n) =>
    n.interactive ? [-1, "Great for mostly static pages; awkward when the whole page is interactive."]
    : n.personal ? [1, "Keeps JavaScript light, but per-user content still needs server rendering per request or fetching in the browser."]
    : n.seo ? [3, "Content pages ship as plain HTML, with JavaScript only for the few interactive widgets."]
    : [1, "Light pages, but the benefit is mostly for content sites."] },
  { name: "Server-rendered pages (MPA)", rate: (n) =>
    !n.server ? [-3, "Needs a server for every request."]
    : n.interactive ? [-1, "Full page loads feel clunky for app-like interaction."]
    : [2, "Rails, Laravel or Django templates (plus htmx if needed): simple, fast, crawlable."] },
];

export default function RenderingPicker() {
  const [needs, setNeeds] = useState<Needs>({ seo: true, personal: false, fresh: true, interactive: false, server: true });
  const ranked = techniques
    .map((t) => { const [score, why] = t.rate(needs); return { name: t.name, score, why }; })
    .sort((a, b) => b.score - a.score);
  // never recommend something the requirements rule out
  const top = ranked.filter((r) => r.score > -2).slice(0, 3);
  const ruledOut = ranked.filter((r) => r.score <= -2);

  return (
    <DemoFrame title="Which rendering technique fits your page?" hint="Tick what's true">
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <Toggle key={q.key} label={q.label} on={needs[q.key]} onChange={(v) => setNeeds({ ...needs, [q.key]: v })} />
        ))}
      </div>

      <ol className="mt-6 space-y-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {top.map((t, i) => (
            <motion.li
              key={t.name}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl border p-4 ${i === 0 ? "border-[#10b981]/60 bg-[#10b981]/[0.06]" : "border-line"}`}
            >
              <p className="text-sm font-medium text-fg">
                <span className="mr-2 font-mono text-xs text-subtle">{i + 1}.</span>{t.name}
                {i === 0 && <span className="ml-2 whitespace-nowrap rounded-full bg-[#10b981]/20 px-2 py-0.5 font-mono text-[10px] text-[#10b981]">best fit</span>}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.why}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {ruledOut.length > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-subtle">
          Ruled out: {ruledOut.map((r) => r.name.replace(/ \(.*\)$/, "")).join(", ")}.
        </p>
      )}
    </DemoFrame>
  );
}
