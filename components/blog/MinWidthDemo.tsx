"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

/** Real CSS, rendered live: a flex item refuses to shrink below its content until it gets min-width: 0. */
export default function MinWidthDemo() {
  const [width, setWidth] = useState(70);
  const [fix, setFix] = useState(false);

  return (
    <DemoFrame title="The flex item that won't shrink" hint="Live CSS">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Slider label="Container width" value={width} min={35} max={100} format={(v) => `${v}%`} onChange={setWidth} />
        <Toggle label="min-width: 0 on the text wrapper" on={fix} onChange={setFix} />
      </div>

      {/* the dashed box is the container; anything past it is overflow */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-black/30 p-4">
        <div className="rounded-xl border border-dashed border-[#a855f7]/60 p-3 transition-[width] duration-300" style={{ width: `${width}%` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ minWidth: fix ? 0 : undefined, flex: "1 1 auto" }} className="rounded-lg bg-white/[0.04] px-3 py-2">
              <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                Enterprise SaaS · Full stack · Case study
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Dealership Portal</p>
            </div>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-2xl border border-line bg-black/40 px-4 py-3 font-mono text-[12px] leading-6 text-muted">
{`.row     { display: flex; }
.wrapper { flex: 1 1 auto;${fix ? " min-width: 0;" : ""} }
.kicker  { white-space: nowrap; overflow: hidden;
           text-overflow: ellipsis; }`}
      </pre>
      <p className="mt-4 min-h-12 text-sm leading-relaxed text-muted">
        {fix
          ? "With min-width: 0 the wrapper is allowed to shrink below its content, so the text inside gets clipped with an ellipsis and the icon stays inside the box."
          : "Narrow the container: the wrapper refuses to shrink below the full width of its unwrapped text, so the text never truncates and the icon is pushed out of the box."}
      </p>
    </DemoFrame>
  );
}
