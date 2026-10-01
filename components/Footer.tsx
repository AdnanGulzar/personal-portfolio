import { profile } from "@/lib/data";
import { Code } from "lucide-react";
import { XIcon } from "./Icons";

export default function Footer() {
  const socials = [
    { href: profile.socials.leetcode, label: "LeetCode", Icon: Code },
    { href: profile.socials.x, label: "X", Icon: XIcon },
  ].filter((s) => s.href);
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <p className="text-sm text-subtle">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, statically generated.
        </p>
        {socials.length > 0 && <div className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-line-strong hover:text-white"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>}
      </div>
    </footer>
  );
}
