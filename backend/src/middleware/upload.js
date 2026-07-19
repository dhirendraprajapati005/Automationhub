import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const UPLOAD_DIR = path.resolve("uploads", "downloads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowlist by extension — the file types this Download Center is actually
// meant to hold (PLC programs, HMI projects, CAD/schematic exports, PDFs,
// zipped sample projects). Rejecting everything else is the main defense
// against someone using the upload endpoint to host arbitrary files.
const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".zip",
  ".dwg",
  ".dxf",
  ".gxw", // WPL Soft PLC program
  ".hmi", // generic HMI project export
  ".dop", // DOPSoft HMI project
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Random filename on disk — never trust or reuse the original filename
    // for storage, both to avoid collisions and path-traversal tricks.
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`File type ${ext} is not allowed`));
  }
  cb(null, true);
};

export const uploadDownloadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export { UPLOAD_DIR };
