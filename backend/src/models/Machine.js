import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 220,
    },
    // Markdown body covering all 9 sections (Working Principle, Components,
    // Electrical Wiring, Pneumatic Diagram, PLC Logic, Sequence of Operation,
    // Common Faults, Troubleshooting, Maintenance) as ## headings — rendered
    // client-side the same way Lesson content is.
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Machine = mongoose.model("Machine", machineSchema);
export default Machine;
