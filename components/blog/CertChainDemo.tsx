"use client";
import { useState } from "react";
import DemoFrame, { Toggle } from "./DemoFrame";

const HOSTS = ["adnangul.com", "www.adnangul.com", "blog.adnangul.com", "dev.api.adnangul.com"];

// A wildcard covers exactly one label: *.example.com matches www.example.com,
// but not example.com itself or a.b.example.com.
const matches = (host: string, name: string) => {
  if (!name.startsWith("*.")) return host === name;
  const rest = name.slice(1); // ".adnangul.com"
  return host.endsWith(rest) && !host.slice(0, -rest.length).includes(".") && host.length > rest.length;
};

type Status = "pass" | "fail" | "warn";
const colors: Record<Status, string> = { pass: "#10b981", fail: "#ef4444", warn: "#f59e0b" };

function Cert({ title, sub, state }: { title: string; sub: string; state: "ok" | "bad" | "missing" }) {
  const color = state === "ok" ? "#10b981" : state === "bad" ? "#ef4444" : "#f59e0b";
  return (
    <div className={`min-w-0 rounded-xl border px-3 py-2 ${state === "missing" ? "border-dashed opacity-70" : ""}`} style={{ borderColor: `${color}66` }}>
      <p className="truncate text-xs font-medium text-fg">{title}</p>
      <p className="truncate font-mono text-[10px] text-subtle">{sub}</p>
    </div>
  );
}

export default function CertChainDemo() {
  const [host, setHost] = useState(HOSTS[0]);
  const [wildcard, setWildcard] = useState(false);
  const [expired, setExpired] = useState(false);
  const [noIntermediate, setNoIntermediate] = useState(false);
  const [untrusted, setUntrusted] = useState(false);
  const [tampered, setTampered] = useState(false);
  const [noKey, setNoKey] = useState(false);

  const names = wildcard ? ["*.adnangul.com"] : ["adnangul.com", "www.adnangul.com"];
  const nameOk = names.some((n) => matches(host, n));

  const checks: { label: string; status: Status; detail: string; error?: string }[] = [
    untrusted
      ? { label: "Chain ends at a trusted root", status: "fail", detail: "The root isn't in the browser's or OS's trust store, so nothing vouches for the chain.", error: "NET::ERR_CERT_AUTHORITY_INVALID" }
      : noIntermediate
        ? { label: "Chain ends at a trusted root", status: "warn", detail: "The server didn't send the intermediate. Some browsers fetch or already know it; curl, many apps and some phones fail. Works on your laptop, breaks for others." }
        : { label: "Chain ends at a trusted root", status: "pass", detail: "Leaf → intermediate → a root the device already trusts." },
    tampered
      ? { label: "Every signature verifies", status: "fail", detail: "The leaf was changed after the CA signed it, so the intermediate's signature no longer matches.", error: "Certificate invalid" }
      : { label: "Every signature verifies", status: "pass", detail: "Each certificate is signed by the key in the one above it." },
    expired
      ? { label: "Within its validity dates", status: "fail", detail: "The leaf's \"not after\" date has passed.", error: "NET::ERR_CERT_DATE_INVALID" }
      : { label: "Within its validity dates", status: "pass", detail: "Today is between \"not before\" and \"not after\"." },
    nameOk
      ? { label: "Issued for this hostname", status: "pass", detail: `${host} matches ${names.find((n) => matches(host, n))}.` }
      : { label: "Issued for this hostname", status: "fail", detail: `${host} isn't covered by ${names.join(", ")}.${wildcard ? " A wildcard matches exactly one label." : ""}`, error: "NET::ERR_CERT_COMMON_NAME_INVALID" },
    noKey
      ? { label: "Server proves it holds the private key", status: "fail", detail: "Anyone can copy a certificate; it's public. Without the private key the server can't sign the handshake, so the connection fails.", error: "Handshake fails" }
      : { label: "Server proves it holds the private key", status: "pass", detail: "The server signed this handshake with the key matching the certificate." },
  ];
  const firstFail = checks.find((c) => c.status === "fail");
  const anyWarn = checks.some((c) => c.status === "warn");

  return (
    <DemoFrame title="What the browser checks in a certificate" hint="Break it">
      <div className="flex flex-wrap gap-2">
        {HOSTS.map((h) => (
          <button key={h} type="button" aria-pressed={host === h} onClick={() => setHost(h)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${host === h ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white" : "border-line text-muted hover:border-line-strong hover:text-white"}`}>
            https://{h}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle label="Wildcard certificate" on={wildcard} onChange={setWildcard} />
        <Toggle label="Expired" on={expired} onChange={setExpired} />
        <Toggle label="Intermediate not sent" on={noIntermediate} onChange={setNoIntermediate} />
        <Toggle label="Self-signed / unknown root" on={untrusted} onChange={setUntrusted} />
        <Toggle label="Edited after signing" on={tampered} onChange={setTampered} />
        <Toggle label="Attacker without the private key" on={noKey} onChange={setNoKey} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Cert title={wildcard ? "*.adnangul.com" : "adnangul.com"} sub={`leaf · ${expired ? "expired" : "valid 90 days"}`} state={expired || tampered || !nameOk ? "bad" : "ok"} />
        <Cert title="Example Issuing CA" sub={noIntermediate ? "intermediate · not sent" : "intermediate"} state={noIntermediate ? "missing" : "ok"} />
        <Cert title={untrusted ? "Unknown Root CA" : "Example Root CA"} sub={untrusted ? "root · not trusted" : "root · in trust store"} state={untrusted ? "bad" : "ok"} />
      </div>

      <ul className="mt-5 space-y-2">
        {checks.map((c) => (
          <li key={c.label} className="flex gap-3 text-sm">
            <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: colors[c.status] }} />
            <span className="min-w-0">
              <span className="text-fg">{c.label}</span>
              <span className="block text-xs leading-relaxed text-muted">{c.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Result</span>
        <span className="font-mono text-lg" style={{ color: firstFail ? "#ef4444" : anyWarn ? "#f59e0b" : "#10b981" }}>
          {firstFail ? firstFail.error : anyWarn ? "Depends on the client" : "🔒 Secure connection"}
        </span>
      </div>
    </DemoFrame>
  );
}
