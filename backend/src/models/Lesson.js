import mongoose from "mongoose";
import { TRACK_SLUGS } from "../config/tracks.js";

const lessonSchema = new mongoose.Schema(
  {
    track: {
      type: String,
      required: true,
      enum: TRACK_SLUGS,
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
    },
    summary: {
      type: String,
      required: true,
      maxlength: 220,
    },
    // Markdown body, rendered client-side with react-markdown
    content: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    estimatedMinutes: {
      type: Number,
      default: 10,
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    // Denormalized on the author account for a byline; not a strict foreign key requirement
    author: {
      type: String,
      default: "AutomationHub Team",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// A lesson slug only needs to be unique within its own track
lessonSchema.index({ track: 1, slug: 1 }, { unique: true });

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
