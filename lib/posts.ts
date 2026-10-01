// ─────────────────────────────────────────────────────────────
//  Blog posts. Each entry's content lives in content/blog/<slug>.mdx
//  To add a post: create the .mdx file, then add an entry here (newest first).
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
];

export const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
