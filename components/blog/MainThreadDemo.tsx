"use client";
import { useEffect, useRef, useState } from "react";
import DemoFrame from "./DemoFrame";

const BLOCK_MS = 1500;

/**
 * Real, not simulated: the top ball is a CSS animation of `transform`, which the browser runs on the
 * compositor thread. The bottom ball is moved by JavaScript in requestAnimationFrame on the main thread.
 * "Block" runs a busy loop on the main thread, exactly like a slow event handler would.
 */
export default function MainThreadDemo() {
  const jsBall = useRef<HTMLSpanElement>(null);
  const [blocking, setBlocking] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      // same 2s back-and-forth as the CSS animation
      const p = ((now - start) % 2000) / 2000;
      const x = p < 0.5 ? p * 2 : 2 - p * 2;
      if (jsBall.current) jsBall.current.style.left = `calc(${x * 100}% - ${x * 24}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const block = () => {
    setBlocking(true);
    setResult(null);
    // let React paint the "blocking" state first, then freeze the main thread
    setTimeout(() => {
      const t0 = performance.now();
      while (performance.now() - t0 < BLOCK_MS) { /* busy: nothing else on the main thread can run */ }
      setBlocking(false);
      setResult(`The main thread was blocked for ${BLOCK_MS} ms.`);
    }, 50);
  };

  const lane = "relative h-9 rounded-xl border border-line bg-black/30";
  const ball = "absolute top-1/2 size-6 -translate-y-1/2 rounded-full";

  return (
    <DemoFrame title="Block the main thread and watch what keeps moving" hint="Runs in your browser">
      {/* translateX(100%) is relative to the element itself, so animate a wrapper as wide as the track minus the ball */}
      <style>{`@keyframes demo-slide{from{transform:translateX(0)}to{transform:translateX(100%)}}`}</style>

      <p className="text-xs text-muted">CSS <code className="font-mono text-fg">transform</code> animation (compositor thread)</p>
      <div className={`${lane} mt-1.5`}>
        <div className="absolute inset-y-0 left-0 right-6" style={{ animation: "demo-slide 1s ease-in-out infinite alternate" }}>
          <span className={`${ball} left-0 bg-[#10b981]`} />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">JavaScript <code className="font-mono text-fg">requestAnimationFrame</code> animation (main thread)</p>
      <div className={`${lane} mt-1.5`}>
        <span ref={jsBall} className={`${ball} bg-[#a855f7]`} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={block}
          disabled={blocking}
          className="rounded-full border border-[#ef4444]/60 bg-[#ef4444]/10 px-4 py-2 text-sm text-white transition hover:bg-[#ef4444]/20 disabled:opacity-60"
        >
          {blocking ? "Blocking…" : `Block the main thread for ${BLOCK_MS / 1000}s`}
        </button>
        <button
          type="button"
          onClick={() => setClicks(clicks + 1)}
          className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-line-strong hover:text-white"
        >
          Click me while it&apos;s blocked ({clicks})
        </button>
      </div>

      <p className="mt-4 min-h-16 text-sm leading-relaxed text-muted">
        {result
          ? `${result} The green ball kept sliding because the compositor thread animated it. The purple ball froze, and any clicks you made were only handled once the main thread was free again.`
          : "Press the red button. While the busy loop runs, try clicking the other button and scrolling the page."}
      </p>
    </DemoFrame>
  );
}
