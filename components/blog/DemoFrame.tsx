/** Shared frame for interactive blog demos. */
export default function DemoFrame({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-10 overflow-hidden rounded-3xl border border-line">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <span className="text-sm font-medium text-fg">{title}</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          <span className="size-1.5 rounded-full bg-linear-to-r from-[#3b82f6] to-[#a855f7]" />
          {hint ?? "Interactive"}
        </span>
      </figcaption>
      <div className="p-5 sm:p-6">{children}</div>
    </figure>
  );
}

/** Small labelled range input used across demos. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  format = (v) => String(v),
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-xs text-muted">
        {label}
        <span className="font-mono text-fg">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#a855f7]"
      />
    </label>
  );
}

/** Pill toggle used across demos. */
export function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-xs transition ${
        on
          ? "border-[#a855f7]/60 bg-[#a855f7]/15 text-white"
          : "border-line text-muted hover:border-line-strong hover:text-white"
      }`}
    >
      <span
        className={`relative h-3.5 w-6 shrink-0 rounded-full transition ${on ? "bg-[#a855f7]" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 size-2.5 rounded-full bg-white transition-all ${on ? "left-3" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}
