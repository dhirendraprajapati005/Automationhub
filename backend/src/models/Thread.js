import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["question", "project"],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Uploaded image paths (relative filenames on disk, same pattern as Download)
    images: [{ type: String }],
    tags: [{ type: String, trim: true }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

threadSchema.index({ type: 1, createdAt: -1 });

const Thread = mongoose.model("Thread", threadSchema);
export default Thread;
