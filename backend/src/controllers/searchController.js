import Lesson from "../models/Lesson.js";
import Machine from "../models/Machine.js";
import Post from "../models/Post.js";
import WiringDiagram from "../models/WiringDiagram.js";
import Fault from "../models/Fault.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  GET /api/search?q=...
// @desc   Searches titles/symptoms across all major content types and
//         returns a unified result list. Simple case-insensitive substring
//         match — good enough for a content library this size without
//         needing a dedicated search engine.
const search = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) {
    return res.json({ results: [] });
  }

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [lessons, machines, posts, wiringDiagrams, faults] = await Promise.all([
    Lesson.find({ isPublished: true, $or: [{ title: regex }, { summary: regex }, { tags: regex }] })
      .select("track slug title summary")
      .limit(8),
    Machine.find({ isPublished: true, $or: [{ title: regex }, { summary: regex }, { tags: regex }] })
      .select("slug title summary")
      .limit(8),
    Post.find({ isPublished: true, $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
      .select("type slug title excerpt")
      .limit(8),
    WiringDiagram.find({ isPublished: true, $or: [{ title: regex }, { description: regex }, { tags: regex }] })
      .select("slug title description")
      .limit(8),
    Fault.find({ isPublished: true, $or: [{ symptom: regex }, { description: regex }, { tags: regex }] })
      .select("slug symptom description")
      .limit(8),
  ]);

  const results = [
    ...lessons.map((l) => ({
      type: "Lesson",
      title: l.title,
      snippet: l.summary,
      path: `/learn/${l.track}/${l.slug}`,
    })),
    ...machines.map((m) => ({
      type: "Machine",
      title: m.title,
      snippet: m.summary,
      path: `/machine-library/${m.slug}`,
    })),
    ...posts.map((p) => ({
      type: p.type === "blog" ? "Blog" : "News",
      title: p.title,
      snippet: p.excerpt,
      path: `/${p.type}/${p.slug}`,
    })),
    ...wiringDiagrams.map((w) => ({
      type: "Wiring Diagram",
      title: w.title,
      snippet: w.description,
      path: `/wiring-diagrams/${w.slug}`,
    })),
    ...faults.map((f) => ({
      type: "Fault Finder",
      title: f.symptom,
      snippet: f.description,
      path: `/fault-finder/${f.slug}`,
    })),
  ];

  res.json({ results, query: q });
});

export { search };
