"use client";
import { Sandpack, type SandpackFiles } from "@codesandbox/sandpack-react";

// Matches the site palette (navy background, purple accent)
const theme = {
  colors: {
    surface1: "#070f26",
    surface2: "#0a1430",
    surface3: "#101c3d",
    clickable: "#a1a1a1",
    base: "#ededed",
    disabled: "#6b6b6b",
    hover: "#ffffff",
    accent: "#a855f7",
    error: "#f87171",
    errorSurface: "#2a1020",
  },
  syntax: {
    plain: "#ededed",
    comment: { color: "#6b6b6b", fontStyle: "italic" as const },
    keyword: "#ff7b72",
    tag: "#7ee787",
    punctuation: "#a1a1a1",
    definition: "#d2a8ff",
    property: "#79c0ff",
    static: "#ffa657",
    string: "#a5d6ff",
  },
  font: {
    body: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono Variable", ui-monospace, monospace',
    size: "13px",
    lineHeight: "1.7",
  },
};

/** Live, editable code example (runs in the browser via Sandpack). */
export default function CodePlayground({
  files,
  template = "react",
  title,
}: {
  files: SandpackFiles;
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts";
  title?: string;
}) {
  return (
    <figure className="my-10 overflow-hidden rounded-3xl border border-line">
      {title && (
        <figcaption className="flex items-center justify-between border-b border-line px-5 py-3 text-sm">
          <span className="font-medium text-fg">{title}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Live code · edit me</span>
        </figcaption>
      )}
      <Sandpack
        template={template}
        files={files}
        theme={theme}
        options={{ editorHeight: 380, showLineNumbers: true, showTabs: true, wrapContent: true }}
      />
    </figure>
  );
}
