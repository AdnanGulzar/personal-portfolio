"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DemoFrame from "./DemoFrame";

type Key = "C" | "A" | "P";
const props: Record<Key, { name: string; desc: string; color: string }> = {
  C: { name: "Consistency", desc: "Every read sees the latest write.", color: "#3b82f6" },
  A: { name: "Availability", desc: "Every request gets a response.", color: "#10b981" },
  P: { name: "Partition tolerance", desc: "Keeps working when the network splits.", color: "#a855f7" },
};

const outcomes: Record<string, { title: string; body: string; examples: string }> = {
  CP: {
    title: "CP — correct or nothing",
    body: "During a network split, nodes that can't confirm the latest data refuse requests. You never read stale data, but some users see errors.",
    examples: "Banking ledgers, inventory counts · MongoDB (default), HBase, etcd, ZooKeeper",
  },
  AP: {
    title: "AP — always answer, fix it later",
    body: "Every node keeps answering during a split, even if it might return slightly old data. Nodes reconcile once the network heals (eventual consistency).",
    examples: "Social feeds, likes, shopping carts · Cassandra, DynamoDB, CouchDB",
  },
  CA: {
    title: "CA — only without a network",
    body: "You can have both only if partitions never happen, which in practice means a single machine. Any real distributed system must tolerate partitions, so the actual choice is between CP and AP.",
    examples: "A single-node PostgreSQL or MySQL server",
  },
};

export default function CapTheorem() {
  const [picked, setPicked] = useState<Key[]>(["C", "P"]);
  const toggle = (k: Key) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k].slice(-2)));
  const combo = (["C", "A", "P"] as Key[]).filter((k) => picked.includes(k)).join("");
  const result = picked.length === 2 ? outcomes[combo] : null;

  return (
    <DemoFrame title="CAP theorem: pick any two" hint="Click to choose">
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(props) as Key[]).map((k) => {
          const on = picked.includes(k);
          const { name, desc, color } = props[k];
          return (
            <motion.button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              whileTap={{ scale: 0.97 }}
              aria-pressed={on}
              className="rounded-2xl border p-4 text-left transition"
              style={{ borderColor: on ? color : "rgba(255,255,255,0.08)" }}
            >
              <span className="font-mono text-2xl font-semibold" style={{ color: on ? color : "#6b6b6b" }}>{k}</span>
              <span className="mt-1 block text-sm font-medium text-fg">{name}</span>
              <span className="mt-1 block text-xs text-muted">{desc}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 min-h-[120px]">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key={combo} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-line p-4">
              <p className="font-medium text-white">{result.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{result.body}</p>
              <p className="mt-3 font-mono text-[11px] text-subtle">{result.examples}</p>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6 text-center text-sm text-subtle">
              Pick two properties to see the trade-off.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </DemoFrame>
  );
}
