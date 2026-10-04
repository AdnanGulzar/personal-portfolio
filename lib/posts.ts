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
