"use client";
import { useEffect, useState } from "react";
import DemoFrame from "./DemoFrame";

type Spec = [number, number, number]; // (ids, classes/attributes/pseudo-classes, elements/pseudo-elements)

const add = (a: Spec, b: Spec): Spec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const cmp = (a: Spec, b: Spec) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const max = (list: Spec[]) => list.reduce((m, s) => (cmp(s, m) > 0 ? s : m), [0, 0, 0] as Spec);

// Split on top-level commas, ignoring commas inside (…) or […].
function splitList(s: string) {
  const out: string[] = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  return [...out, cur].map((x) => x.trim()).filter(Boolean);
}

// Read the contents of a (…) group starting just after the opening paren.
function readGroup(s: string, i: number) {
  let depth = 1, j = i;
  while (j < s.length && depth) { if (s[j] === "(") depth++; else if (s[j] === ")") depth--; j++; }
  return { inner: s.slice(i, j - 1), end: j };
}

const LEGACY_PSEUDO_ELEMENTS = ["before", "after", "first-line", "first-letter"];

// Specificity of one complex selector, following Selectors Level 4.
function specificity(sel: string): Spec {
  let s: Spec = [0, 0, 0];
  let i = 0;
  const ident = /^-?[_a-zA-Z][\w-]*/;
  while (i < sel.length) {
    const ch = sel[i];
    const rest = sel.slice(i);
    if (ch === "#") { const m = rest.slice(1).match(ident); s = add(s, [1, 0, 0]); i += 1 + (m?.[0].length ?? 0); }
    else if (ch === ".") { const m = rest.slice(1).match(ident); s = add(s, [0, 1, 0]); i += 1 + (m?.[0].length ?? 0); }
    else if (ch === "[") { const j = sel.indexOf("]", i); s = add(s, [0, 1, 0]); i = j === -1 ? sel.length : j + 1; }
    else if (rest.startsWith("::")) {
      const m = rest.slice(2).match(ident);
      s = add(s, [0, 0, 1]);
      i += 2 + (m?.[0].length ?? 0);
      if (sel[i] === "(") i = readGroup(sel, i + 1).end;
    }
    else if (ch === ":") {
      const name = (rest.slice(1).match(ident)?.[0] ?? "").toLowerCase();
      i += 1 + name.length;
      let arg: string | null = null;
      if (sel[i] === "(") { const g = readGroup(sel, i + 1); arg = g.inner; i = g.end; }
      if (name === "where") continue; // always zero
      if (["is", "not", "has"].includes(name)) { s = add(s, max(splitList(arg ?? "").map(specificity))); continue; }
      if ((name === "nth-child" || name === "nth-last-child") && arg && / of /.test(arg)) {
        s = add(add(s, [0, 1, 0]), max(splitList(arg.split(/ of /)[1]).map(specificity)));
        continue;
      }
      s = add(s, LEGACY_PSEUDO_ELEMENTS.includes(name) ? [0, 0, 1] : [0, 1, 0]);
    }
    else if (ident.test(rest)) { const m = rest.match(ident)!; s = add(s, [0, 0, 1]); i += m[0].length; }
    else i++; // *, combinators, whitespace
  }
  return s;
}

function valid(sel: string) {
  try { return typeof CSS !== "undefined" && CSS.supports(`selector(${sel})`); } catch { return false; }
}

const presets: [string, string][] = [
  ["#nav a", ".nav .menu .item a"],
  ["button.primary", ".btn.btn-primary"],
  [":is(#main, p) span", "div.card span"],
  [":where(#main) span", "span"],
  ["ul li:nth-child(2)", "ul li.active"],
];

function Score({ s, win }: { s: Spec; win: boolean }) {
  return (
    <div className="mt-2 flex gap-1.5">
      {(["IDs", "classes", "types"] as const).map((l, k) => (
        <span key={l} className={`flex-1 rounded-lg border px-2 py-1.5 text-center ${win ? "border-[#10b981]/60 bg-[#10b981]/10" : "border-line"}`}>
          <span className="block font-mono text-lg text-white">{s[k]}</span>
          <span className="block text-[10px] text-subtle">{l}</span>
        </span>
      ))}
    </div>
  );
}

export default function SpecificityDemo() {
  const [a, setA] = useState(presets[0][0]);
  const [b, setB] = useState(presets[0][1]);
  const sa = max(splitList(a).map(specificity));
  const sb = max(splitList(b).map(specificity));
  // CSS.supports only exists in the browser; treat selectors as valid until mounted so server and client HTML match
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const okA = !mounted || valid(a), okB = !mounted || valid(b);
  const c = cmp(sa, sb);
  const verdict = !okA || !okB ? "Fix the invalid selector to compare."
    : c > 0 ? "Rule A wins: it's compared column by column, left to right, and A is higher in the first column that differs."
    : c < 0 ? "Rule B wins: it's compared column by column, left to right, and B is higher in the first column that differs."
    : "A tie, so the rule that appears later in the stylesheet wins. Here that's B.";

  const input = "w-full rounded-xl border bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#a855f7]/70";

  return (
    <DemoFrame title="Which rule wins? Type two selectors" hint="Specificity">
      <div className="flex flex-wrap gap-2">
        {presets.map(([x, y]) => (
          <button key={x + y} type="button" onClick={() => { setA(x); setB(y); }} className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted transition hover:border-line-strong hover:text-white">
            {x} vs {y}
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {([["A", a, setA, sa, okA, c > 0], ["B (later in the file)", b, setB, sb, okB, c <= 0]] as const).map(([label, v, set, s, ok, win]) => (
          <label key={label} className="block min-w-0">
            <span className="text-xs text-muted">Rule {label}</span>
            <input value={v} onChange={(e) => set(e.target.value)} spellCheck={false} aria-label={`Selector ${label}`} className={`${input} mt-1.5 ${ok ? "border-line" : "border-[#ef4444]/70"}`} />
            {ok ? <Score s={s} win={win && okA && okB} /> : <p className="mt-2 text-xs text-[#ef4444]">Not a valid selector</p>}
          </label>
        ))}
      </div>
      <p className="mt-5 min-h-12 text-sm leading-relaxed text-muted">{verdict}</p>
    </DemoFrame>
  );
}
