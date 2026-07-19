import path from "path";
import fs from "fs";
import Download, { DOWNLOAD_CATEGORIES } from "../models/Download.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { UPLOAD_DIR } from "../middleware/upload.js";

// @route  GET /api/downloads
// @desc   List published downloads, optionally filtered by category
const listDownloads = asyncHandler(async (req, res) => {
  const { category, sort, limit } = req.query;
  const filter = { isPublished: true };
  if (category && DOWNLOAD_CATEGORIES.includes(category)) {
    filter.category = category;
  }

  const sortOption = sort === "popular" ? { downloadCount: -1 } : { createdAt: -1 };

  const downloads = await Download.find(filter)
    .select("title description category originalFileName fileSizeBytes fileExtension downloadCount tags createdAt")
    .sort(sortOption)
    .limit(limit ? Math.min(50, parseInt(limit)) : 0);

  res.json({ downloads, categories: DOWNLOAD_CATEGORIES });
});

// @route  GET /api/downloads/:id/file
// @desc   Stream the actual file to the client and increment the download counter
const downloadFile = asyncHandler(async (req, res) => {
  const item = await Download.findOne({ _id: req.params.id, isPublished: true });
  if (!item) return res.status(404).json({ message: "Download not found" });

  const filePath = path.join(UPLOAD_DIR, item.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File is missing from storage" });
  }

  item.downloadCount += 1;
  await item.save();

  res.download(filePath, item.originalFileName);
});

// @route  POST /api/downloads
// @desc   Admin: upload a new download
const createDownload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file was uploaded" });
  }
  const { title, description, category, tags } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Title, description, and category are required" });
  }
  if (!DOWNLOAD_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `Category must be one of: ${DOWNLOAD_CATEGORIES.join(", ")}` });
  }

  const download = await Download.create({
    title,
    description,
    category,
    fileName: req.file.filename,
    originalFileName: req.file.originalname,
    fileSizeBytes: req.file.size,
    fileExtension: path.extname(req.file.originalname).toLowerCase(),
    uploadedBy: req.user._id,
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  });

  res.status(201).json({ download });
});

// @route  DELETE /api/downloads/:id
// @desc   Admin: remove a download (and its file from disk)
const deleteDownload = asyncHandler(async (req, res) => {
  const item = await Download.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Download not found" });

  const filePath = path.join(UPLOAD_DIR, item.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  await item.deleteOne();

  res.json({ message: "Download removed" });
});

export { listDownloads, downloadFile, createDownload, deleteDownload };
