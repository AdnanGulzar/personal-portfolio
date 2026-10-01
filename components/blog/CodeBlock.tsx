"use client";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Code block (`pre` from MDX/Shiki) with a copy button in the top-right corner. */
export default function CodeBlock(props: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      // Shiki puts a space on empty lines so they keep their height; strip trailing whitespace on copy
      const text = (ref.current?.innerText ?? "").replace(/[ \t ]+$/gm, "").replace(/\n+$/, "");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="group/code relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-md border border-white/15 bg-[#24292e] text-[#e1e4e8]/70 opacity-60 transition hover:text-white group-hover/code:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
