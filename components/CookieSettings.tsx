"use client";
import { GA_ID } from "@/lib/site";
import { OPEN_CONSENT_EVENT } from "./Analytics";

/** Footer link that reopens the analytics consent banner. */
export default function CookieSettings() {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="text-xs text-subtle underline-offset-4 transition hover:text-white hover:underline"
    >
      Cookie settings
    </button>
  );
}
