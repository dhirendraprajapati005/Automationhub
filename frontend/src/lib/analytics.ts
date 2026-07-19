// Loads Google Analytics 4 only if VITE_GA_MEASUREMENT_ID is set in the
// environment. Without it, every function here is a harmless no-op —
// there's no fake or placeholder tracking ID shipped by default.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let isLoaded = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const initAnalytics = () => {
  if (!GA_ID || isLoaded) return;
  isLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // send_page_view disabled here — pageviews are sent explicitly on each
  // route change via trackPageview(), since this is a client-routed SPA
  // where the initial page load isn't the only "page" that matters.
  window.gtag("config", GA_ID, { send_page_view: false });
};

export const trackPageview = (path: string, title?: string) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", name, params);
};
