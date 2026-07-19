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

  const lesson = await Lesson.findOne({ track, slug, isPublished: true });
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

export { getTracks, getTrackLessons, getLesson };
