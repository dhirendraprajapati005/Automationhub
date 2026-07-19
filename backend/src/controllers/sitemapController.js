import Lesson from "../models/Lesson.js";
import Machine from "../models/Machine.js";
import Post from "../models/Post.js";
import WiringDiagram from "../models/WiringDiagram.js";
import Fault from "../models/Fault.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/learn", priority: "0.9", changefreq: "weekly" },
  { path: "/machine-library", priority: "0.9", changefreq: "weekly" },
  { path: "/calculators", priority: "0.9", changefreq: "monthly" },
  { path: "/downloads", priority: "0.7", changefreq: "weekly" },
  { path: "/wiring-diagrams", priority: "0.7", changefreq: "weekly" },
  { path: "/fault-finder", priority: "0.7", changefreq: "weekly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/news", priority: "0.7", changefreq: "weekly" },
  { path: "/community", priority: "0.6", changefreq: "daily" },
  { path: "/about", priority: "0.4", changefreq: "monthly" },
  { path: "/contact", priority: "0.4", changefreq: "monthly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
];

const xmlEscape = (str) =>
  String(str).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

const urlEntry = (loc, lastmod, priority, changefreq) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// @route  GET /sitemap.xml
// @desc   Builds a real sitemap from current published content, not a static
//         file — new lessons, machines, and posts appear automatically.
//         NOTE: for this to be reachable at https://yourdomain.com/sitemap.xml
//         in production, your hosting/proxy needs to route that path to this
//         backend (see README) since the frontend and backend are typically
//         deployed to different origins.
const getSitemap = asyncHandler(async (req, res) => {
  const siteUrl = (process.env.SITE_URL || "https://automationhub.dev").replace(/\/$/, "");

  const [lessons, machines, posts, wiringDiagrams, faults] = await Promise.all([
    Lesson.find({ isPublished: true }).select("track slug updatedAt"),
    Machine.find({ isPublished: true }).select("slug updatedAt"),
    Post.find({ isPublished: true }).select("type slug updatedAt"),
    WiringDiagram.find({ isPublished: true }).select("slug updatedAt"),
    Fault.find({ isPublished: true }).select("slug updatedAt"),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(`${siteUrl}${r.path}`, null, r.priority, r.changefreq)),
    ...lessons.map((l) => urlEntry(`${siteUrl}/learn/${l.track}/${l.slug}`, l.updatedAt, "0.6", "monthly")),
    ...machines.map((m) => urlEntry(`${siteUrl}/machine-library/${m.slug}`, m.updatedAt, "0.6", "monthly")),
    ...posts.map((p) => urlEntry(`${siteUrl}/${p.type}/${p.slug}`, p.updatedAt, "0.5", "monthly")),
    ...wiringDiagrams.map((w) => urlEntry(`${siteUrl}/wiring-diagrams/${w.slug}`, w.updatedAt, "0.5", "monthly")),
    ...faults.map((f) => urlEntry(`${siteUrl}/fault-finder/${f.slug}`, f.updatedAt, "0.5", "monthly")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

export { getSitemap };
