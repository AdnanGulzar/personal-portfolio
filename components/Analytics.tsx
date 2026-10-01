"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { useReportWebVitals } from "next/web-vitals";
import { GA_ID } from "@/lib/site";

type Consent = "granted" | "denied" | null;
const KEY = "analytics-consent";
export const OPEN_CONSENT_EVENT = "open-cookie-settings";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const readConsent = (): Consent => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};

/**
 * Google Analytics 4 + Core Web Vitals reporting, loaded only after the visitor accepts
 * (UK GDPR / PECR require consent for analytics cookies). Does nothing while NEXT_PUBLIC_GA_ID is unset.
 */
export default function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const reopen = () => setConsent(null);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  // Real-user performance metrics (LCP, INP, CLS, FCP, TTFB) → GA4 events
  useReportWebVitals((metric) => {
    window.gtag?.("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating, // "good" | "needs-improvement" | "poor"
      non_interaction: true,
    });
  });

  const choose = (c: "granted" | "denied") => {
    try { localStorage.setItem(KEY, c); } catch { /* storage blocked */ }
    if (c === "denied") {
      // turn tracking off immediately for an already-loaded tag, and remove GA's cookies
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      const host = location.hostname.replace(/^www\./, "");
      document.cookie.split(";").map((x) => x.split("=")[0].trim()).filter((n) => n.startsWith("_ga")).forEach((n) => {
        for (const domain of ["", `; domain=.${host}`]) document.cookie = `${n}=; Max-Age=0; path=/${domain}`;
      });
    }
    setConsent(c);
  };

  if (!GA_ID) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('consent', 'update', { analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      <AnimatePresence>
        {ready && consent === null && (
          <motion.div
            role="dialog"
            aria-label="Cookie consent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-2xl border border-line bg-black/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:left-6 sm:right-auto sm:mx-0"
          >
            <p className="text-sm leading-relaxed text-muted">
              I use Google Analytics to see which pages are useful and how fast the site loads for real visitors. No ads, no selling data.
              Is that OK?
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => choose("granted")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85">
                Accept
              </button>
              <button type="button" onClick={() => choose("denied")} className="rounded-full border border-line px-4 py-2 text-sm text-fg transition hover:border-line-strong">
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
