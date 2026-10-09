// ─────────────────────────────────────────────────────────────
//  Blog posts. Each entry's content lives in content/blog/<slug>.mdx
//  To add a post: create the .mdx file, then add an entry here.
//  The list is sorted newest first below, so order here doesn't matter.
// ─────────────────────────────────────────────────────────────

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readingTime: string;
  tags: string[];
  accent: string; // card / header glow colour
};

export const posts: Post[] = [
  {
    slug: "how-apps-communicate",
    title: "How software talks: REST, GraphQL, gRPC, webhooks and queues",
    description:
      "Synchronous calls vs asynchronous messages, what each API style is good at and what it costs, receiving webhooks safely, and the rules of message queues. With demos using real bytes.",
    date: "2026-10-08",
    readingTime: "15 min read",
    tags: ["APIs", "Backend", "Architecture"],
    accent: "#d946ef",
  },
  {
    slug: "real-time-on-the-web",
    title: "Real-time on the web: polling, SSE, WebSockets and beyond",
    description:
      "How the server sends you something when HTTP only lets you ask: polling, long polling, Server-Sent Events, WebSockets, WebRTC and WebTransport, and what breaks in production.",
    date: "2026-10-08",
    readingTime: "13 min read",
    tags: ["Networking", "WebSockets", "Backend"],
    accent: "#f43f5e",
  },
  {
    slug: "how-https-works",
    title: "How HTTPS works: key exchange, certificates and the TLS handshake",
    description:
      "What HTTPS protects and what it doesn't, how two strangers agree on a secret in public, the TLS 1.3 handshake step by step, and what the browser checks in a certificate. With demos.",
    date: "2026-10-08",
    readingTime: "13 min read",
    tags: ["Security", "Networking", "Fundamentals"],
    accent: "#22c55e",
  },
  {
    slug: "inside-the-browser",
    title: "Inside the browser: processes, threads and the 16 ms frame",
    description:
      "Part 2 of How browsers work: rendering engines, sandboxed processes and site isolation, the main thread vs the compositor, how a frame is made, and why pages jank. With a demo that really blocks your main thread.",
    date: "2026-10-08",
    readingTime: "12 min read",
    tags: ["Browsers", "Performance", "Fundamentals"],
    accent: "#06b6d4",
  },
  {
    slug: "frontend-rendering-techniques",
    title: "Frontend rendering techniques: pros and cons of every approach",
    description:
      "MPA, SPA, SSR, SSG, ISR, streaming, partial prerendering, islands, Server Components and resumability: how each works, what it's good at, what it costs, and how to choose.",
    date: "2026-10-08",
    readingTime: "15 min read",
    tags: ["Frontend", "Rendering", "Architecture"],
    accent: "#f97316",
  },
  {
    slug: "how-nextjs-renders",
    title: "How Next.js renders a page: SSG, SSR, ISR, streaming and PPR",
    description:
      "When and where each rendering mode fetches data and builds HTML, partial prerendering with Cache Components in Next.js 16, and who sees stale data with ISR. With timeline demos.",
    date: "2026-10-08",
    readingTime: "14 min read",
    tags: ["Next.js", "React", "Rendering"],
    accent: "#14b8a6",
  },
  {
    slug: "how-sql-queries-run",
    title: "How SQL queries actually run: parsing, planning and indexes",
    description:
      "The order a query really runs in, how the planner picks a plan from statistics, when it ignores your index, join algorithms, EXPLAIN, and what happens on a write.",
    date: "2026-10-08",
    readingTime: "12 min read",
    tags: ["SQL", "Databases", "Performance"],
    accent: "#eab308",
  },
  {
    slug: "how-to-scale-a-system",
    title: "How to scale a system, and what to watch out for",
    description:
      "The stages of scaling a web app, from one server to sharded databases, and the failure modes that cause real outages: retry storms, missing timeouts, tail latency and overload.",
    date: "2026-10-08",
    readingTime: "13 min read",
    tags: ["System Design", "Scalability", "Backend"],
    accent: "#8b5cf6",
  },
  {
    slug: "how-v8-works",
    title: "How the V8 engine works: bytecode, JIT tiers and hidden classes",
    description:
      "How V8 parses lazily, runs bytecode in Ignition, tiers up through Sparkplug, Maglev and TurboFan, and uses hidden classes and inline caches to make dynamic objects fast.",
    date: "2026-10-04",
    readingTime: "11 min read",
    tags: ["JavaScript", "V8", "Performance"],
    accent: "#ef4444",
  },
  {
    slug: "how-css-works",
    title: "How CSS works: the cascade, specificity, layout and stacking",
    description:
      "How the browser picks one value per property, why specificity is compared column by column, why flex items won't shrink, and why z-index: 9999 doesn't work.",
    date: "2026-10-04",
    readingTime: "11 min read",
    tags: ["CSS", "Layout", "Fundamentals"],
    accent: "#0ea5e9",
  },
  {
    slug: "how-nodejs-works",
    title: "How Node.js works: one thread, thousands of connections",
    description:
      "V8 and libuv, what the 4-thread pool does (and doesn't) handle, the phases of Node's event loop, and why one blocking request slows down every user. With a demo where you block a server yourself.",
    date: "2026-10-03",
    readingTime: "13 min read",
    tags: ["Node.js", "Backend", "Fundamentals"],
    accent: "#84cc16",
  },
  {
    slug: "how-typescript-works",
    title: "How TypeScript works: inference, narrowing and type erasure",
    description:
      "What the compiler checks, how it infers and narrows types line by line, and why every type is gone at runtime. With a narrowing demo and a live playground.",
    date: "2026-10-03",
    readingTime: "11 min read",
    tags: ["TypeScript", "Compilers", "Fundamentals"],
    accent: "#6366f1",
  },
  {
    slug: "how-browsers-work",
    title: "How browsers work: from typing a URL to pixels on screen",
    description:
      "DNS, TCP, TLS and HTTP, then parsing, the DOM and CSSOM, layout, paint and compositing. Follow one request end to end, with demos of where the time goes.",
    date: "2026-10-03",
    readingTime: "12 min read",
    tags: ["Browsers", "Networking", "Fundamentals"],
    accent: "#ec4899",
  },
  {
    slug: "how-javascript-works",
    title: "How JavaScript works: engine, call stack and event loop",
    description:
      "What happens when a line of JavaScript runs: parsing and JIT compilation, the call stack and heap, hoisting, closures and the event loop, with a step-by-step demo.",
    date: "2026-10-01",
    readingTime: "10 min read",
    tags: ["JavaScript", "Event Loop", "Fundamentals"],
    accent: "#f59e0b",
  },
  {
    slug: "how-react-works",
    title: "How React works: rendering, reconciliation and hooks",
    description:
      "What JSX compiles to, what rendering really means, how React diffs trees and uses keys, and why state is a snapshot. With live demos and a 30-line React you can edit.",
    date: "2026-10-01",
    readingTime: "11 min read",
    tags: ["React", "Rendering", "Fundamentals"],
    accent: "#06b6d4",
  },
  {
    slug: "frontend-performance",
    title: "Frontend performance, explained by playing with it",
    description:
      "Core Web Vitals, wasted re-renders, debouncing and bundle size, each with a live demo you can poke at to see what actually makes a page feel fast.",
    date: "2026-09-24",
    readingTime: "11 min read",
    tags: ["React", "Performance", "Web Vitals"],
    accent: "#10b981",
  },
  {
    slug: "what-is-system-design",
    title: "What is system design? A hands-on introduction",
    description:
      "Load balancers, caches, databases and the trade-offs between them. Scale a toy app from one server to many and watch where it breaks.",
    date: "2026-09-10",
    readingTime: "12 min read",
    tags: ["System Design", "Backend", "Scalability"],
    accent: "#3b82f6",
  },
].sort((a, b) => b.date.localeCompare(a.date)); // stable: same-day posts keep their order

export const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
