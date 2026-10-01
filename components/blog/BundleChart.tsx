"use client";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DemoFrame, { Toggle } from "./DemoFrame";

// Illustrative numbers from a typical dashboard clean-up (KB transferred on first load)
const data = [
  { name: "JavaScript", before: 820, after: 190, how: "Code splitting, tree shaking, dropping moment.js" },
  { name: "Images", before: 1400, after: 320, how: "WebP/AVIF, correct sizes, lazy loading" },
  { name: "Fonts", before: 300, after: 60, how: "WOFF2, subsetting, one variable font" },
  { name: "CSS", before: 180, after: 35, how: "Purged unused styles" },
];

export default function BundleChart() {
  const [showAfter, setShowAfter] = useState(true);
  const total = (k: "before" | "after") => data.reduce((n, d) => n + d[k], 0);

  return (
    <DemoFrame title="What a first page load weighs, before and after">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Toggle label="Show optimised build" on={showAfter} onChange={setShowAfter} />
        <p className="font-mono text-xs text-muted">
          {(total("before") / 1000).toFixed(1)} MB
          {showAfter && <> → <span className="text-[#10b981]">{(total("after") / 1000).toFixed(2)} MB</span> ({Math.round((1 - total("after") / total("before")) * 100)}% less)</>}
        </p>
      </div>
      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }} barGap={4}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b6b6b", fontSize: 11 }} stroke="rgba(255,255,255,0.1)" unit=" KB" />
            <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1a1", fontSize: 12 }} stroke="rgba(255,255,255,0.1)" width={78} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{ background: "#0a1430", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, fontSize: 12 }}
              formatter={(v, n) => [`${v} KB`, n === "before" ? "Before" : "After"]}
              labelFormatter={(label) => {
                const d = data.find((x) => x.name === label);
                return d ? `${label}: ${d.how}` : String(label);
              }}
            />
            <Legend formatter={(v) => (v === "before" ? "Before" : "After")} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="before" fill="#ef4444" fillOpacity={0.7} radius={[0, 6, 6, 0]} />
            {showAfter && <Bar dataKey="after" fill="#10b981" radius={[0, 6, 6, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DemoFrame>
  );
}
