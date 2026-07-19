import { SITE_URL, SITE_NAME } from "@/hooks/useSEO";

export const buildBreadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const buildArticleSchema = (opts: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: opts.headline,
  description: opts.description,
  url: `${SITE_URL}${opts.path}`,
  ...(opts.datePublished && { datePublished: opts.datePublished }),
  ...(opts.dateModified && { dateModified: opts.dateModified }),
  author: { "@type": "Organization", name: opts.authorName || SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
});

export const buildTechArticleSchema = (opts: {
  headline: string;
  description: string;
  path: string;
  dateModified?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: opts.headline,
  description: opts.description,
  url: `${SITE_URL}${opts.path}`,
  ...(opts.dateModified && { dateModified: opts.dateModified }),
  publisher: { "@type": "Organization", name: SITE_NAME },
});

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Free learning platform for PLC programming, industrial automation, HMI, SCADA, VFD, servo systems, sensors, pneumatics, robotics, and industrial networking.",
});

export const buildFAQSchema = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});
