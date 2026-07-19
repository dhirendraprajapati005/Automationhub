import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["blog", "news"],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: {
      type: String,
      default: "AutomationHub Team",
    },
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

postSchema.index({ type: 1, slug: 1 }, { unique: true });
postSchema.index({ type: 1, publishedAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
