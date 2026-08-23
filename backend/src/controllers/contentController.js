import Lesson from "../models/Lesson.js";
import { TRACKS, TRACK_SLUGS } from "../config/tracks.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  GET /api/content/tracks
// @desc   List all learning tracks with their published lesson counts
const getTracks = asyncHandler(async (req, res) => {
  const counts = await Lesson.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$track", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));

  const tracks = TRACKS.map((track) => ({
    ...track,
    lessonCount: countMap[track.slug] || 0,
  }));

  res.json({ tracks });
});

// @route  GET /api/content/tracks/:track
// @desc   List published lessons for one track, ordered for a course path
const getTrackLessons = asyncHandler(async (req, res) => {
  const { track } = req.params;
  if (!TRACK_SLUGS.includes(track)) {
    return res.status(404).json({ message: `Unknown track: ${track}` });
  }

  const meta = TRACKS.find((t) => t.slug === track);
  const lessons = await Lesson.find({ track, isPublished: true })
    .select("slug title summary difficulty estimatedMinutes order tags")
    .sort({ order: 1 });

  res.json({ track: meta, lessons });
});

// @route  GET /api/content/tracks/:track/:slug
// @desc   Get one lesson's full content, plus its neighbors for prev/next nav
const getLesson = asyncHandler(async (req, res) => {
  const { track, slug } = req.params;

  const lesson = await Lesson.findOneAndUpdate(
    { track, slug, isPublished: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  );
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  const siblings = await Lesson.find({ track, isPublished: true })
    .select("slug title order")
    .sort({ order: 1 });

  const index = siblings.findIndex((s) => s.slug === slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index < siblings.length - 1 ? siblings[index + 1] : null;

  res.json({ lesson, prev, next });
});

// --- Admin ---------------------------------------------------------------

// @route  GET /api/content/admin/lessons
// @desc   List ALL lessons (including unpublished) for the admin course manager
const listAllLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find()
    .select("track slug title summary difficulty estimatedMinutes order isPublished updatedAt")
    .sort({ track: 1, order: 1 });
  res.json({ lessons, tracks: TRACKS });
});

// @route  GET /api/content/admin/lessons/:id
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  res.json({ lesson });
});

// @route  POST /api/content/admin/lessons
const createLesson = asyncHandler(async (req, res) => {
  const { track, slug, title, summary, content, difficulty, estimatedMinutes, order, tags, isPublished } = req.body;

  if (!track || !slug || !title || !summary || !content) {
    return res.status(400).json({ message: "track, slug, title, summary, and content are required" });
  }
  if (!TRACK_SLUGS.includes(track)) {
    return res.status(400).json({ message: `track must be one of: ${TRACK_SLUGS.join(", ")}` });
  }

  const lesson = await Lesson.create({
    track,
    slug,
    title,
    summary,
    content,
    difficulty: difficulty || "beginner",
    estimatedMinutes: estimatedMinutes || 10,
    order: order || 0,
    tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    isPublished: isPublished ?? true,
  });

  res.status(201).json({ lesson });
});

// @route  PUT /api/content/admin/lessons/:id
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });

  const { track, slug, title, summary, content, difficulty, estimatedMinutes, order, tags, isPublished } = req.body;

  if (track !== undefined) {
    if (!TRACK_SLUGS.includes(track)) {
      return res.status(400).json({ message: `track must be one of: ${TRACK_SLUGS.join(", ")}` });
    }
    lesson.track = track;
  }
  if (slug !== undefined) lesson.slug = slug;
  if (title !== undefined) lesson.title = title;
  if (summary !== undefined) lesson.summary = summary;
  if (content !== undefined) lesson.content = content;
  if (difficulty !== undefined) lesson.difficulty = difficulty;
  if (estimatedMinutes !== undefined) lesson.estimatedMinutes = estimatedMinutes;
  if (order !== undefined) lesson.order = order;
  if (tags !== undefined) {
    lesson.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (isPublished !== undefined) lesson.isPublished = isPublished;

  await lesson.save();
  res.json({ lesson });
});

// @route  DELETE /api/content/admin/lessons/:id
const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  await lesson.deleteOne();
  res.json({ message: "Lesson deleted" });
});

export {
  getTracks,
  getTrackLessons,
  getLesson,
  listAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
