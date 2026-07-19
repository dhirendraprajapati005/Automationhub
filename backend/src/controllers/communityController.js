import Thread from "../models/Thread.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { processAndSaveImage, deleteImage } from "../utils/imageProcessing.js";

// Reputation awards — deliberately small, simple, and applied server-side
// only (never trust a client-submitted reputation delta).
const REPUTATION = {
  POST_THREAD: 5,
  POST_COMMENT: 2,
  RECEIVE_LIKE: 1,
};

// @route  GET /api/community/threads
const listThreads = asyncHandler(async (req, res) => {
  const { type, tag, sort } = req.query;
  const filter = {};
  if (type && ["question", "project"].includes(type)) filter.type = type;
  if (tag) filter.tags = tag;

  const sortOption = sort === "popular" ? { commentCount: -1, createdAt: -1 } : { createdAt: -1 };

  const threads = await Thread.find(filter)
    .populate("author", "name avatar reputationPoints")
    .sort(sortOption)
    .limit(100);

  res.json({
    threads: threads.map((t) => ({
      _id: t._id,
      type: t.type,
      title: t.title,
      body: t.body.slice(0, 220),
      author: t.author,
      images: t.images,
      tags: t.tags,
      likeCount: t.likedBy.length,
      commentCount: t.commentCount,
      viewCount: t.viewCount,
      createdAt: t.createdAt,
    })),
  });
});

// @route  POST /api/community/threads
const createThread = asyncHandler(async (req, res) => {
  const { title, body, type, tags } = req.body;
  if (!title || !body || !type) {
    return res.status(400).json({ message: "title, body, and type are required" });
  }
  if (!["question", "project"].includes(type)) {
    return res.status(400).json({ message: "type must be question or project" });
  }

  // Each uploaded image is resized and re-encoded to compressed WebP before
  // it's written to disk — see utils/imageProcessing.js.
  const images = await Promise.all((req.files || []).map((f) => processAndSaveImage(f.buffer)));

  const thread = await Thread.create({
    title,
    body,
    type,
    author: req.user._id,
    images,
    tags: (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { reputationPoints: REPUTATION.POST_THREAD } });

  const populated = await thread.populate("author", "name avatar reputationPoints");
  res.status(201).json({ thread: populated });
});

// @route  GET /api/community/threads/:id
const getThread = asyncHandler(async (req, res) => {
  const thread = await Thread.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate("author", "name avatar reputationPoints");
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  const comments = await Comment.find({ thread: thread._id })
    .populate("author", "name avatar reputationPoints")
    .sort({ createdAt: 1 });

  res.json({ thread, comments });
});

// @route  POST /api/community/threads/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ message: "Comment body is required" });

  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: "Thread not found" });
  if (thread.isLocked) return res.status(403).json({ message: "This thread is locked" });

  const comment = await Comment.create({ thread: thread._id, author: req.user._id, body });
  thread.commentCount += 1;
  await thread.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { reputationPoints: REPUTATION.POST_COMMENT } });

  const populated = await comment.populate("author", "name avatar reputationPoints");
  res.status(201).json({ comment: populated });
});

// @route  POST /api/community/threads/:id/like  — toggles like on/off
const toggleThreadLike = asyncHandler(async (req, res) => {
  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  const userId = String(req.user._id);
  const alreadyLiked = thread.likedBy.some((id) => String(id) === userId);

  if (alreadyLiked) {
    thread.likedBy = thread.likedBy.filter((id) => String(id) !== userId);
    if (String(thread.author) !== userId) {
      await User.findByIdAndUpdate(thread.author, { $inc: { reputationPoints: -REPUTATION.RECEIVE_LIKE } });
    }
  } else {
    thread.likedBy.push(req.user._id);
    if (String(thread.author) !== userId) {
      await User.findByIdAndUpdate(thread.author, { $inc: { reputationPoints: REPUTATION.RECEIVE_LIKE } });
    }
  }
  await thread.save();

  res.json({ liked: !alreadyLiked, likeCount: thread.likedBy.length });
});

// @route  POST /api/community/users/:id/follow  — toggles follow on/off
const toggleFollow = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });

  const me = await User.findById(req.user._id);
  const isFollowing = me.following.some((id) => String(id) === req.params.id);

  if (isFollowing) {
    me.following = me.following.filter((id) => String(id) !== req.params.id);
  } else {
    me.following.push(target._id);
  }
  await me.save();

  res.json({ following: !isFollowing });
});

// --- Moderation (admin/moderator) ----------------------------------------

// @route  DELETE /api/community/threads/:id
const deleteThread = asyncHandler(async (req, res) => {
  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: "Thread not found" });
  await Comment.deleteMany({ thread: thread._id });
  await Promise.all(thread.images.map((filename) => deleteImage(filename)));
  await thread.deleteOne();
  res.json({ message: "Thread and its comments removed" });
});

// @route  DELETE /api/community/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  await Thread.findByIdAndUpdate(comment.thread, { $inc: { commentCount: -1 } });
  await comment.deleteOne();
  res.json({ message: "Comment removed" });
});

export { listThreads, createThread, getThread, addComment, toggleThreadLike, toggleFollow, deleteThread, deleteComment };
