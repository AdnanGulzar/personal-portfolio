"use client";
import { useState } from "react";
import DemoFrame, { Toggle } from "./DemoFrame";

const MASK = [0x37, 0xfa, 0x21, 0x3d]; // fixed so the page renders the same on server and client; real clients pick a random key per frame
const hex = (n: number) => n.toString(16).padStart(2, "0");

// A WebSocket text frame as defined in RFC 6455, section 5.2.
function encode(text: string, masked: boolean) {
  const payload = Array.from(new TextEncoder().encode(text));
  const len = payload.length;
  const parts: { label: string; bytes: number[]; color: string; note: string }[] = [
    { label: "FIN + opcode", bytes: [0x81], color: "#3b82f6", note: "FIN=1 (last fragment), opcode 1 = text" },
  ];
  const maskBit = masked ? 0x80 : 0;
  if (len < 126) parts.push({ label: "MASK + length", bytes: [maskBit | len], color: "#a855f7", note: `mask=${masked ? 1 : 0}, length ${len} fits in 7 bits` });
  else if (len < 65_536) parts.push({ label: "MASK + length", bytes: [maskBit | 126, len >> 8, len & 0xff], color: "#a855f7", note: `126 means "real length in the next 2 bytes": ${len}` });
  else parts.push({ label: "MASK + length", bytes: [maskBit | 127, 0, 0, 0, 0, (len >>> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff], color: "#a855f7", note: `127 means "real length in the next 8 bytes"` });
  if (masked) parts.push({ label: "Masking key", bytes: MASK, color: "#f59e0b", note: "4 bytes the payload is XORed with" });
  parts.push({ label: "Payload", bytes: masked ? payload.map((b, i) => b ^ MASK[i % 4]) : payload, color: "#10b981", note: masked ? "your UTF-8 bytes, XORed with the key" : "your UTF-8 bytes as-is" });
  return { parts, len };
}

export default function WsFrameDemo() {
  const [text, setText] = useState("Hello");
  const [fromBrowser, setFromBrowser] = useState(true);
  const { parts, len } = encode(text, fromBrowser);
  const overhead = parts.slice(0, -1).reduce((s, p) => s + p.bytes.length, 0);
  const shown = 48;

  return (
    <DemoFrame title="What a WebSocket message looks like on the wire" hint="RFC 6455">
      <label className="block text-xs text-muted">
        Message
        <input value={text} maxLength={400} onChange={(e) => setText(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-transparent px-3 py-2 font-mono text-sm text-fg outline-none focus:border-[#a855f7]/60" />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle label="Sent by the browser (masked)" on={fromBrowser} onChange={setFromBrowser} />
        <button type="button" onClick={() => setText("x".repeat(200))}
          className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-white">
          Try a 200-byte message
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-1 font-mono text-xs">
        {parts.flatMap((p) => p.bytes.slice(0, p.label === "Payload" ? shown : undefined).map((b, i) => (
          <span key={`${p.label}${i}`} className="rounded px-1.5 py-0.5" style={{ background: `${p.color}22`, color: p.color }}>{hex(b)}</span>
        )))}
        {len > shown && <span className="px-1 py-0.5 text-subtle">… +{len - shown} bytes</span>}
      </div>

      <ul className="mt-4 space-y-1.5 text-xs">
        {parts.map((p) => (
          <li key={p.label} className="flex gap-2">
            <span className="mt-1 size-2 shrink-0 rounded-sm" style={{ background: p.color }} />
            <span className="min-w-0 text-muted"><span className="text-fg">{p.label}</span> ({p.bytes.length} {p.bytes.length === 1 ? "byte" : "bytes"}): {p.note}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Framing overhead</span>
        <span className="font-mono text-2xl text-fg">{overhead} bytes <span className="text-sm text-subtle">for {len} bytes of data</span></span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Once the connection is open, each message costs {overhead} bytes of framing. The same message as an HTTP request would carry
        a request line, cookies and headers, often hundreds of bytes. Browsers must mask what they send so a malicious page can't
        craft bytes that a confused proxy would mistake for a real HTTP request; servers send unmasked.
      </p>
    </DemoFrame>
  );
}
