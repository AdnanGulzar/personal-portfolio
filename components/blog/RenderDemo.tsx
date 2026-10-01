"use client";
import { memo, useRef, useState } from "react";
import DemoFrame, { Toggle } from "./DemoFrame";

const products = ["Keyboard", "Monitor", "Headphones", "Webcam", "Mouse", "Desk lamp"];

function slowDown(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* simulate an expensive render */ }
}

function ProductCard({ name, slow }: { name: string; slow: boolean }) {
  const renders = useRef(0);
  renders.current += 1;
  if (slow) slowDown(25);
  return (
    // key={renders.current} restarts the flash animation on every render
    <div key={renders.current} className="animate-[render-flash_0.6s_ease-out] rounded-xl border border-line px-3 py-2.5">
      <div className="text-sm text-fg">{name}</div>
      <div className="font-mono text-[11px] text-subtle">rendered {renders.current}×</div>
    </div>
  );
}

const MemoProductCard = memo(ProductCard);

export default function RenderDemo() {
  const [query, setQuery] = useState("");
  const [useMemoCards, setUseMemoCards] = useState(false);
  const [slow, setSlow] = useState(true);
  const Card = useMemoCards ? MemoProductCard : ProductCard;

  return (
    <DemoFrame title="Wasted re-renders: type in the box and watch the cards">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle label="Wrap cards in React.memo" on={useMemoCards} onChange={setUseMemoCards} />
        <Toggle label="Expensive cards (25 ms each)" on={slow} onChange={setSlow} />
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a note… (state lives in the parent)"
        className="mt-4 w-full rounded-xl border border-line bg-black/60 px-4 py-3 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-white/40 focus:ring-4 focus:ring-white/5"
      />
      {/* Switching memo on/off remounts the grid so counts start fresh */}
      <div key={String(useMemoCards)} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {products.map((p) => <Card key={p} name={p} slow={slow} />)}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-subtle">
        {useMemoCards
          ? "The cards' props never change, so React skips them. Typing stays instant."
          : "Every keystroke re-renders all six cards, even though nothing about them changed. With expensive cards on, typing feels sluggish (about 150 ms per key)."}
      </p>
    </DemoFrame>
  );
}
