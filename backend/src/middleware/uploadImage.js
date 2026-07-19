import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve("uploads", "community");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// Memory storage, not disk — the buffer gets resized/compressed and
// re-encoded to WebP by processAndSaveImage() before ever touching disk,
// so there's no point writing the raw upload to disk first.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`Image type ${ext} is not allowed`));
  }
  cb(null, true);
};

export const uploadThreadImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 4 }, // 8MB per image, max 4 images
});

export { UPLOAD_DIR as COMMUNITY_UPLOAD_DIR };
