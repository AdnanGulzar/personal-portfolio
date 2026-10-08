"use client";
import { useState } from "react";
import { motion } from "motion/react";
import DemoFrame, { Toggle } from "./DemoFrame";

// Simplified version of how PostgreSQL's planner compares plans: reading the table in order costs
// 1 per page, jumping to a random page costs 4. 1,000,000 rows at ~100 rows per page = 10,000 pages.
const ROWS = 1_000_000, PAGES = 10_000, RANDOM = 4, DEPTH = 3;

const queries = [
  { key: "email", sql: "WHERE email = 'ada@example.com'", col: "email", matches: 1, limit: null as number | null, order: false },
  { key: "recent", sql: "WHERE created_at > now() - interval '1 day'", col: "created_at", matches: 300, limit: null, order: false },
  { key: "country", sql: "WHERE country = 'UK'", col: "country", matches: 200_000, limit: null, order: false },
  { key: "latest", sql: "ORDER BY created_at DESC LIMIT 10", col: "created_at", matches: ROWS, limit: 10, order: true },
  { key: "lower", sql: "WHERE lower(email) = 'ada@example.com'", col: "lower(email)", matches: 1, limit: null, order: false },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");

export default function QueryPlanDemo() {
  const [q, setQ] = useState(queries[0]);
  const [indexed, setIndexed] = useState(false);

  // An index on email can't help lower(email): the planner needs an index on that exact expression.
  const usable = indexed && q.col !== "lower(email)";
  const fetched = q.limit ?? q.matches; // rows the index scan has to visit in the table
  const seqCost = PAGES + (q.order ? PAGES * 2 : 0); // + a full sort when there's ORDER BY
  const idxCost = DEPTH + fetched * RANDOM;
  const useIndex = usable && idxCost < seqCost;
  const rowsRead = useIndex ? fetched : ROWS;

  const plan = useIndex
    ? `Index Scan${q.order ? " Backward" : ""} using users_${q.col}_idx on users\n  ${q.order ? `(stops after ${q.limit} rows)` : `Index Cond: (${q.sql.replace("WHERE ", "")})`}`
    : `${q.order ? "Limit\n  ->  Sort  (sort key: created_at DESC)\n        ->  " : ""}Seq Scan on users${q.order ? "" : `\n  Filter: (${q.sql.replace("WHERE ", "")})`}`;

  const why = !indexed ? "No index on this column, so the only option is to read every row and check it."
    : !usable ? `There's an index on email, but the query filters on lower(email). The index stores the original values, so it can't be used. You'd need an index on the expression lower(email).`
    : useIndex ? `The index jumps straight to the ${q.limit ? `${q.limit} newest rows, already in order, so no sort is needed` : `${fmt(q.matches)} matching row${q.matches === 1 ? "" : "s"}`}. Estimated cost ${fmt(idxCost)} vs ${fmt(seqCost)} for a full scan.`
    : `The index exists, but ${fmt(q.matches)} rows match (20% of the table). Fetching each one from a random page would cost about ${fmt(idxCost)}, versus ${fmt(seqCost)} to just read the whole table in order. So the planner ignores the index.`;

  return (
    <DemoFrame title="Would the planner use your index?" hint="users: 1,000,000 rows">
      <div className="flex flex-wrap gap-2">
        {queries.map((x) => (
          <button key={x.key} type="button" aria-pressed={x.key === q.key} onClick={() => setQ(x)}
            className={`rounded-full border px-3 py-1.5 text-left font-mono text-[11px] transition ${x.key === q.key ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}>
            {x.sql}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Toggle label={`CREATE INDEX ON users (${q.col === "lower(email)" ? "email" : q.col})`} on={indexed} onChange={setIndexed} />
      </div>

      <pre className="mt-5 overflow-x-auto rounded-2xl border border-line bg-black/40 px-4 py-3 font-mono text-[12px] leading-6 text-fg">
        <span className="text-subtle">EXPLAIN SELECT * FROM users {q.sql};{"\n\n"}</span>{plan}
      </pre>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm text-muted">Rows the database reads</span>
        <span className="font-mono text-2xl" style={{ color: useIndex ? "#10b981" : "#ef4444" }}>{fmt(rowsRead)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full" animate={{ width: `${Math.max((rowsRead / ROWS) * 100, 0.6)}%`, backgroundColor: useIndex ? "#10b981" : "#ef4444" }} />
      </div>
      <p className="mt-4 min-h-16 text-sm leading-relaxed text-muted">{why}</p>
      <p className="mt-1 text-xs text-subtle">Simplified cost model (sequential page = 1, random page = 4). Real planners also consider bitmap scans, caching and how the table is physically ordered.</p>
    </DemoFrame>
  );
}
