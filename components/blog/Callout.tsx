import { Info, Lightbulb, TriangleAlert } from "lucide-react";

const styles = {
  info: { Icon: Info, color: "#3b82f6", label: "Note" },
  tip: { Icon: Lightbulb, color: "#10b981", label: "Tip" },
  warn: { Icon: TriangleAlert, color: "#f59e0b", label: "Watch out" },
} as const;

export default function Callout({ type = "info", title, children }: { type?: keyof typeof styles; title?: string; children: React.ReactNode }) {
  const { Icon, color, label } = styles[type];
  return (
    <aside className="my-8 flex gap-4 rounded-2xl border p-5" style={{ borderColor: `${color}40` }}>
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full" style={{ background: `${color}22`, color }}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 text-sm leading-relaxed text-muted [&>p:first-child]:mt-0 [&>p]:mt-2 [&>p]:text-sm">
        <p className="!mt-0 font-medium text-fg">{title ?? label}</p>
        {children}
      </div>
    </aside>
  );
}
