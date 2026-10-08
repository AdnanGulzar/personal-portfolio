"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import DemoFrame from "./DemoFrame";

type Order = { id: number; customer: string; status: string; total: number };
const orders: Order[] = [
  { id: 1, customer: "Ada", status: "paid", total: 120 },
  { id: 2, customer: "Ben", status: "paid", total: 40 },
  { id: 3, customer: "Ada", status: "refunded", total: 300 },
  { id: 4, customer: "Cleo", status: "paid", total: 90 },
  { id: 5, customer: "Ben", status: "paid", total: 75 },
  { id: 6, customer: "Dev", status: "paid", total: 30 },
  { id: 7, customer: "Cleo", status: "paid", total: 60 },
  { id: 8, customer: "Ada", status: "paid", total: 15 },
];

// Lines of the query, in the order you write them.
const sql = [
  { key: "select", text: "SELECT customer, SUM(total) AS spent" },
  { key: "from", text: "FROM orders" },
  { key: "where", text: "WHERE status = 'paid'" },
  { key: "group", text: "GROUP BY customer" },
  { key: "having", text: "HAVING SUM(total) > 100" },
  { key: "order", text: "ORDER BY spent DESC" },
  { key: "limit", text: "LIMIT 2;" },
];

type Table = { cols: string[]; rows: (string | number)[][] };

// The order a database logically evaluates those clauses, computed for real on the data above.
function steps(): { key: string; title: string; note: string; table: Table }[] {
  const all = orders;
  const paid = all.filter((o) => o.status === "paid");
  const groups = new Map<string, Order[]>();
  for (const o of paid) groups.set(o.customer, [...(groups.get(o.customer) ?? []), o]);
  const g = [...groups].map(([c, rows]) => ({ c, totals: rows.map((r) => r.total), sum: rows.reduce((n, r) => n + r.total, 0) }));
  const having = g.filter((x) => x.sum > 100);
  const projected = having.map((x) => [x.c, x.sum] as (string | number)[]);
  const sorted = [...projected].sort((a, b) => Number(b[1]) - Number(a[1]));
  const full: Table = { cols: ["id", "customer", "status", "total"], rows: all.map((o) => [o.id, o.customer, o.status, o.total]) };
  return [
    { key: "from", title: "1. FROM", note: "Start with every row of the table (or the result of the joins).", table: full },
    { key: "where", title: "2. WHERE", note: "Filter individual rows. Aliases from SELECT don't exist yet, which is why you can't use `spent` here.", table: { ...full, rows: paid.map((o) => [o.id, o.customer, o.status, o.total]) } },
    { key: "group", title: "3. GROUP BY", note: "Collapse the remaining rows into one row per customer.", table: { cols: ["customer", "totals in group"], rows: g.map((x) => [x.c, x.totals.join(" + ")]) } },
    { key: "having", title: "4. HAVING", note: "Filter whole groups, using aggregates. Dev drops out here. Ada's refunded £300 order was already removed by WHERE, so it doesn't count towards her total.", table: { cols: ["customer", "SUM(total)"], rows: having.map((x) => [x.c, x.sum]) } },
    { key: "select", title: "5. SELECT", note: "Only now are the output columns computed and named. `spent` exists from here on.", table: { cols: ["customer", "spent"], rows: projected } },
    { key: "order", title: "6. ORDER BY", note: "Sort the result. ORDER BY runs after SELECT, so it can use the `spent` alias.", table: { cols: ["customer", "spent"], rows: sorted } },
    { key: "limit", title: "7. LIMIT", note: "Keep the first rows. The database had to group and sort everything first, which is why LIMIT doesn't automatically make a query cheap.", table: { cols: ["customer", "spent"], rows: sorted.slice(0, 2) } },
  ];
}

const all = steps();
const btn = "inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-white disabled:opacity-40";

export default function QueryOrderDemo() {
  const [i, setI] = useState(0);
  const s = all[i];

  return (
    <DemoFrame title="Written order vs the order it runs" hint={`Step ${i + 1} / ${all.length}`}>
      <pre className="overflow-x-auto rounded-2xl border border-line bg-black/40 py-3 font-mono text-[13px] leading-7">
        {sql.map((l) => (
          <div key={l.key} className={`whitespace-pre px-4 transition-colors ${l.key === s.key ? "bg-[#a855f7]/20 text-white" : "text-muted"}`}>{l.text}</div>
        ))}
      </pre>

      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#d2a8ff]">{s.title}</p>
      <p className="mt-1.5 min-h-12 text-sm leading-relaxed text-muted">{s.note}</p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr>{s.table.cols.map((c) => <th key={c} className="border-b border-line px-3 py-2 font-medium text-fg">{c}</th>)}</tr>
          </thead>
          <tbody>
            {s.table.rows.map((r, n) => (
              <tr key={n}>{r.map((v, m) => <td key={m} className="border-b border-line px-3 py-1.5 text-muted">{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-subtle">{s.table.rows.length} row{s.table.rows.length === 1 ? "" : "s"}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => setI(i - 1)} disabled={i === 0}><ChevronLeft className="size-3.5" /> Back</button>
        <button type="button" className={btn} onClick={() => setI(i + 1)} disabled={i === all.length - 1}>Next <ChevronRight className="size-3.5" /></button>
        <button type="button" className={btn} onClick={() => setI(0)} disabled={i === 0}><RotateCcw className="size-3.5" /> Reset</button>
      </div>
    </DemoFrame>
  );
}
