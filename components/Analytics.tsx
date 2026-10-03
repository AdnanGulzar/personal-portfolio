"use client";
import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { CF_BEACON_TOKEN, GA_ID } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Google Analytics 4 (+ Core Web Vitals) and Cloudflare Web Analytics. Each stays off while its env var is unset. */
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

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      {/* Cookieless page views + Web Vitals; works on any host, the domain doesn't need to be on Cloudflare */}
      {CF_BEACON_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
