import type { MDXComponents } from "mdx/types";
import Callout from "@/components/blog/Callout";
import CodeBlock from "@/components/blog/CodeBlock";
import CodePlayground from "@/components/blog/CodePlayground";
import ScalingSimulator from "@/components/blog/ScalingSimulator";
import CapTheorem from "@/components/blog/CapTheorem";
import LatencyNumbers from "@/components/blog/LatencyNumbers";
import WebVitals from "@/components/blog/WebVitals";
import DebounceDemo from "@/components/blog/DebounceDemo";
import RenderDemo from "@/components/blog/RenderDemo";
import BundleChart from "@/components/blog/BundleChart";
import EventLoopDemo from "@/components/blog/EventLoopDemo";
import KeysDemo from "@/components/blog/KeysDemo";
import StateSnapshotDemo from "@/components/blog/StateSnapshotDemo";
import RequestWaterfall from "@/components/blog/RequestWaterfall";
import RenderPipelineDemo from "@/components/blog/RenderPipelineDemo";

const slug = (children: React.ReactNode) =>
  String(Array.isArray(children) ? children.join("") : children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Typography for every blog post, plus the interactive components posts can use without importing.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 id={slug(children)} className="mt-14 scroll-mt-28 text-2xl font-semibold tracking-tight text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 id={slug(children)} className="mt-9 scroll-mt-28 text-lg font-semibold tracking-tight text-white">{children}</h3>
    ),
    p: ({ children }) => <p className="mt-5 leading-[1.8] text-muted">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-white underline decoration-[#a855f7]/60 underline-offset-4 transition hover:decoration-[#a855f7]" target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-muted marker:text-[#a855f7]">{children}</ul>,
    ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted marker:text-subtle">{children}</ol>,
    li: ({ children }) => <li className="pl-1 leading-[1.8]">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-[#a855f7] pl-5 font-serif text-xl italic text-fg [&>p]:text-fg">{children}</blockquote>
    ),
    hr: () => <hr className="my-14 border-line" />,
    pre: (props) => <CodeBlock {...props} />,
    table: ({ children }) => (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="border-b border-line px-4 py-3 font-medium text-fg">{children}</th>,
    td: ({ children }) => <td className="border-b border-line px-4 py-3 text-muted">{children}</td>,
    Callout,
    CodePlayground,
    ScalingSimulator,
    CapTheorem,
    LatencyNumbers,
    WebVitals,
    DebounceDemo,
    RenderDemo,
    BundleChart,
    EventLoopDemo,
    KeysDemo,
    StateSnapshotDemo,
    RequestWaterfall,
    RenderPipelineDemo,
    ...components,
  };
}
