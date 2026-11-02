// Google Analytics events for the actions that matter: boards created,
// published, scheduled and delivered, invites sent and messages added. GA4
// attributes each one to the visit's source (utm tags or referrer), so its
// reports show which channels lead to boards, not just visits.
//
// The gtag script loads after the page (app/layout.tsx); events sent before
// then wait in dataLayer, which is how the standard gtag snippet works.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      // gtag.js reads the `arguments` object itself, so this must stay a
      // plain function rather than a rest-parameter one.
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
    }
    window.gtag('event', name, params);
  } catch {}
}
