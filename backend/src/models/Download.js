import mongoose from "mongoose";

export const DOWNLOAD_CATEGORIES = [
  "PLC Programs",
  "HMI Projects",
  "CAD Drawings",
  "Electrical Schematics",
  "Wiring Diagrams",
  "Sample Projects",
  "PDF Manuals",
];

const downloadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: DOWNLOAD_CATEGORIES,
    },
    // Path on disk relative to the uploads directory — never the absolute
    // server path, so the storage location can move without touching data.
    fileName: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    fileExtension: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [{ type: String, trim: true }],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

downloadSchema.index({ category: 1, createdAt: -1 });

const Download = mongoose.model("Download", downloadSchema);
export default Download;
