import { Router } from "express";
import { listDownloads, downloadFile, createDownload, deleteDownload } from "../controllers/downloadController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { uploadDownloadFile } from "../middleware/upload.js";

const router = Router();

router.get("/", listDownloads);
router.get("/:id/file", downloadFile);

// Admin-only management
router.post("/", protect, restrictTo("admin"), uploadDownloadFile.single("file"), createDownload);
router.delete("/:id", protect, restrictTo("admin"), deleteDownload);

export default router;
