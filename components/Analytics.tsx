"use client";
import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { GA_ID } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Google Analytics 4 + Core Web Vitals reporting. Does nothing while NEXT_PUBLIC_GA_ID is unset. */
export default function Analytics() {
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

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
