"use client";
import { useState } from "react";
import DemoFrame, { Slider } from "./DemoFrame";

// Textbook Diffie-Hellman with tiny numbers. The maths is real; only the size is toy.
const P = 23;
const G = 5; // a primitive root mod 23, so every secret 1..22 gives a different public value

const modPow = (base: number, exp: number, mod: number) => {
  let r = 1, b = base % mod, e = exp;
  while (e > 0) {
    if (e & 1) r = (r * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return r;
};

function Party({ name, color, secret, mine, theirs, theirLabel }: { name: string; color: string; secret: number; mine: number; theirs: number; theirLabel: string }) {
  return (
    <div className="min-w-0 rounded-2xl border p-4" style={{ borderColor: `${color}55` }}>
      <p className="text-sm font-medium" style={{ color }}>{name}</p>
      <dl className="mt-3 space-y-2 font-mono text-xs">
        <div className="flex justify-between gap-2"><dt className="text-subtle">secret (never sent)</dt><dd className="text-fg">{secret}</dd></div>
        <div className="flex justify-between gap-2"><dt className="text-subtle">sends {G}^{secret} mod {P}</dt><dd className="text-fg">{mine}</dd></div>
        <div className="flex justify-between gap-2 border-t border-line pt-2"><dt className="text-subtle">{theirLabel}^{secret} mod {P}</dt><dd className="text-[#10b981]">{modPow(theirs, secret, P)}</dd></div>
      </dl>
    </div>
  );
}

export default function KeyExchangeDemo() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(15);
  const A = modPow(G, a, P);
  const B = modPow(G, b, P);
  const shared = modPow(B, a, P);
  // the eavesdropper's only option with these numbers: try every exponent until one gives A
  const tries = Array.from({ length: P - 1 }, (_, i) => i + 1).findIndex((x) => modPow(G, x, P) === A) + 1;

  return (
    <DemoFrame title="Agree on a secret in public" hint="Diffie-Hellman">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Browser's secret number" value={a} min={1} max={P - 1} onChange={setA} />
        <Slider label="Server's secret number" value={b} min={1} max={P - 1} onChange={setB} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Party name="Browser" color="#3b82f6" secret={a} mine={A} theirs={B} theirLabel={String(B)} />
        <Party name="Server" color="#a855f7" secret={b} mine={B} theirs={A} theirLabel={String(A)} />
      </div>

      <div className="mt-3 rounded-2xl border border-[#ef4444]/40 p-4 font-mono text-xs">
        <p className="font-sans text-sm font-medium text-[#ef4444]">Eavesdropper on the network sees</p>
        <p className="mt-2 text-muted">p = {P}, g = {G}, browser sent <span className="text-fg">{A}</span>, server sent <span className="text-fg">{B}</span></p>
        <p className="mt-1 text-muted">
          To get the key it needs a secret back from {A}: tries {G}^1, {G}^2, … and finds it after <span className="text-fg">{tries}</span> {tries === 1 ? "try" : "tries"}.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-sm text-muted">Shared secret, computed on both sides, never sent</span>
        <span className="font-mono text-2xl text-[#10b981]">{shared}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Both sides end up with {G}^({a}×{b}) mod {P} = {shared}, but only the two numbers {A} and {B} ever crossed the network.
        With {P - 1} possible secrets the eavesdropper wins instantly. Real TLS does the same thing on an elliptic curve (X25519) with
        secrets around 2<sup>255</sup> in size, where the best known attacks would take far longer than the age of the universe.
      </p>
    </DemoFrame>
  );
}
