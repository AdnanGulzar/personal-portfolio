"use client";
import { useState } from "react";
import DemoFrame, { Slider, Toggle } from "./DemoFrame";

const hex = (n: number) => n.toString(16).padStart(2, "0");

// Base-128 varint: 7 bits per byte, low bits first, top bit set on every byte except the last.
const varint = (n: number) => {
  const out: number[] = [];
  do { let b = n & 0x7f; n = Math.floor(n / 128); if (n) b |= 0x80; out.push(b); } while (n);
  return out;
};

// message User { int32 id = 1; string name = 2; bool active = 3; }
// proto3 leaves out fields that hold their default value (0, "", false).
function encode(id: number, name: string, active: boolean) {
  const parts: { label: string; bytes: number[]; color: string }[] = [];
  if (id) parts.push({ label: `id = ${id}: tag 08 (field 1, varint) + varint`, bytes: [0x08, ...varint(id)], color: "#3b82f6" });
  if (name) {
    const s = Array.from(new TextEncoder().encode(name));
    parts.push({ label: `name: tag 12 (field 2, length-delimited) + length ${s.length} + UTF-8`, bytes: [0x12, ...varint(s.length), ...s], color: "#a855f7" });
  }
  if (active) parts.push({ label: "active = true: tag 18 (field 3, varint) + 01", bytes: [0x18, 0x01], color: "#10b981" });
  return parts;
}

export default function ProtobufDemo() {
  const [id, setId] = useState(150);
  const [name, setName] = useState("Adnan");
  const [active, setActive] = useState(true);
  const json = JSON.stringify({ id, name, active });
  const jsonBytes = new TextEncoder().encode(json).length;
  const parts = encode(id, name, active);
  const pbBytes = parts.reduce((s, p) => s + p.bytes.length, 0);

  return (
    <DemoFrame title="The same object as JSON and as Protocol Buffers" hint="Real encoding">
      <pre className="overflow-x-auto rounded-xl bg-white/[0.04] p-3 font-mono text-[11px] text-muted">{"message User {\n  int32  id     = 1;\n  string name   = 2;\n  bool   active = 3;\n}"}</pre>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="id" value={id} min={0} max={300_000} step={50} format={(v) => v.toLocaleString("en-GB")} onChange={setId} />
        <label className="block text-xs text-muted">
          name
          <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-transparent px-3 py-1.5 font-mono text-sm text-fg outline-none focus:border-[#a855f7]/60" />
        </label>
      </div>
      <div className="mt-3"><Toggle label="active" on={active} onChange={setActive} /></div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">JSON · {jsonBytes} bytes</p>
      <p className="mt-2 break-all rounded-xl bg-white/[0.04] p-3 font-mono text-xs text-fg">{json}</p>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Protobuf · {pbBytes} bytes</p>
      <div className="mt-2 flex min-h-8 flex-wrap gap-1 font-mono text-xs">
        {parts.flatMap((p) => p.bytes.map((b, i) => (
          <span key={`${p.label}${i}`} className="rounded px-1.5 py-0.5" style={{ background: `${p.color}22`, color: p.color }}>{hex(b)}</span>
        )))}
        {parts.length === 0 && <span className="py-0.5 text-subtle">(empty: every field is at its default)</span>}
      </div>
      <ul className="mt-3 space-y-1 text-xs text-muted">
        {parts.map((p) => (
          <li key={p.label} className="flex gap-2"><span className="mt-1 size-2 shrink-0 rounded-sm" style={{ background: p.color }} />{p.label}</li>
        ))}
      </ul>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
        Protobuf is {jsonBytes ? Math.round((1 - pbBytes / jsonBytes) * 100) : 0}% smaller here because it never sends field names, only field
        numbers from the shared schema, and stores numbers in as few bytes as they need ({id.toLocaleString("en-GB")} takes {id ? varint(id).length : 0}).
        The price: the bytes are meaningless without the <code className="font-mono text-fg">.proto</code> file, so both sides must share it.
        After gzip the gap narrows, but the CPU cost of parsing text stays.
      </p>
    </DemoFrame>
  );
}
