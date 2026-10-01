"use client";
import { useRef, useState } from "react";
import DemoFrame, { Toggle } from "./DemoFrame";

const start = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
];
const extra = ["Mango", "Kiwi", "Peach", "Plum", "Grape", "Lemon"];

let domNodes = 0;

function Row({ name }: { name: string }) {
  // Assigned once per mount: the same number means React reused the same DOM node
  const node = useRef(0);
  if (node.current === 0) node.current = ++domNodes;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
      <span className="w-16 shrink-0 text-sm text-fg">{name}</span>
      <input
        defaultValue={`note about ${name}`}
        aria-label={`Note for ${name}`}
        className="min-w-0 flex-1 rounded-lg border border-line bg-black/50 px-2.5 py-1.5 text-xs text-fg outline-none focus:border-white/40"
      />
      <span className="shrink-0 font-mono text-[10px] text-subtle">node #{node.current}</span>
    </li>
  );
}

const btn = "rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-white";

export default function KeysDemo() {
  const [items, setItems] = useState(start);
  const [useIndex, setUseIndex] = useState(true);
  const [run, setRun] = useState(0); // remounts the list on reset

  const addToTop = () => {
    const name = extra[(items.length - start.length) % extra.length];
    setItems([{ id: Date.now(), name }, ...items]);
  };
  const reset = (index = useIndex) => {
    domNodes = 0;
    setUseIndex(index);
    setItems(start);
    setRun(run + 1);
  };

  return (
    <DemoFrame title="Why keys matter: add an item to the top of the list">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle label={useIndex ? "key={index}" : "key={item.id}"} on={!useIndex} onChange={(v) => reset(!v)} />
        <button type="button" className={btn} onClick={addToTop}>Add to top</button>
        <button type="button" className={btn} onClick={() => reset()}>Reset</button>
      </div>
      <ul key={run} className="mt-4 space-y-2">
        {items.map((it, i) => <Row key={useIndex ? i : it.id} name={it.name} />)}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-subtle">
        {useIndex
          ? "With index keys, React matches rows by position. The new item at the top gets row 0's existing DOM node, so the notes no longer line up with the fruit (look at the node numbers). Switch to key={item.id} and try again."
          : "With stable ids, React knows the existing rows just moved down. It creates one new DOM node for the new item and keeps every note attached to the right fruit."}
      </p>
    </DemoFrame>
  );
}
