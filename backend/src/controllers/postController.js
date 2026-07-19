import Post from "../models/Post.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const VALID_TYPES = ["blog", "news"];

// @route  GET /api/posts/:type  (type = blog | news)
const listPosts = asyncHandler(async (req, res) => {
  const { type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: "type must be blog or news" });
  }

  const posts = await Post.find({ type, isPublished: true })
    .select("slug title excerpt authorName tags publishedAt")
    .sort({ publishedAt: -1 });

  res.json({ posts });
});

// @route  GET /api/posts/:type/:slug
const getPost = asyncHandler(async (req, res) => {
  const { type, slug } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: "type must be blog or news" });
  }

  const post = await Post.findOne({ type, slug, isPublished: true });
  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json({ post });
});

// --- Admin ---------------------------------------------------------------

// @route  GET /api/posts/:type/admin/all  — includes unpublished, for the admin list view
const listAllPosts = asyncHandler(async (req, res) => {
  const { type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: "type must be blog or news" });
  }
  const posts = await Post.find({ type }).sort({ createdAt: -1 });
  res.json({ posts });
});

// @route  POST /api/posts/:type
const createPost = asyncHandler(async (req, res) => {
  const { type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: "type must be blog or news" });
  }
  const { title, slug, excerpt, content, tags, isPublished } = req.body;
  if (!title || !slug || !excerpt || !content) {
    return res.status(400).json({ message: "title, slug, excerpt, and content are required" });
  }

  const post = await Post.create({
    type,
    title,
    slug,
    excerpt,
    content,
    author: req.user._id,
    authorName: req.user.name,
    tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    isPublished: isPublished ?? true,
  });

  res.status(201).json({ post });
});

// @route  PUT /api/posts/:type/:id
const updatePost = asyncHandler(async (req, res) => {
  const { title, slug, excerpt, content, tags, isPublished } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (title !== undefined) post.title = title;
  if (slug !== undefined) post.slug = slug;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) {
    post.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (isPublished !== undefined) post.isPublished = isPublished;

  await post.save();
  res.json({ post });
});

// @route  DELETE /api/posts/:type/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

export { listPosts, getPost, listAllPosts, createPost, updatePost, deletePost };
