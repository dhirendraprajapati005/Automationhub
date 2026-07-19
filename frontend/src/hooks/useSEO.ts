import { useEffect } from "react";

const SITE_NAME = "AutomationHub";
// Matches SITE_URL in the backend .env — keep these in sync in production.
const SITE_URL = "https://automationhub.dev";

interface SEOOptions {
  title: string;
  description: string;
  path: string; // e.g. "/learn/plc/what-is-a-plc-scan-cycle"
  type?: "website" | "article";
  /** JSON-LD structured data object(s) to embed for this page. */
  structuredData?: object | object[];
}

const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/**
 * Sets per-page title, meta description, Open Graph, Twitter Card, and
 * canonical URL tags, plus optional JSON-LD structured data. Runs client-side,
 * which means it's picked up correctly by browsers and by crawlers that
 * execute JavaScript (Googlebot does). It does NOT help crawlers that fetch
 * raw HTML without running JS — Facebook, Twitter/X, LinkedIn, Slack link
 * previews all fall in that category. Fixing that fully requires
 * server-side rendering or pre-rendering, which this client-rendered SPA
 * doesn't do; this hook is the correct best-effort short of that rewrite.
 */
export const useSEO = ({ title, description, path, type = "website", structuredData }: SEOOptions) => {
  // Serialize once so the effect only re-runs when the actual data changes,
  // not on every render where a caller passes a fresh object literal.
  const structuredDataJSON = structuredData ? JSON.stringify(structuredData) : undefined;

  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", url);
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    let structuredDataEl: HTMLScriptElement | null = null;
    if (structuredDataJSON) {
      structuredDataEl = document.createElement("script");
      structuredDataEl.type = "application/ld+json";
      structuredDataEl.text = structuredDataJSON;
      document.head.appendChild(structuredDataEl);
    }

    return () => {
      if (structuredDataEl) document.head.removeChild(structuredDataEl);
    };
  }, [title, description, path, type, structuredDataJSON]);
};

export { SITE_URL, SITE_NAME };
