import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { COMMUNITY_UPLOAD_DIR } from "../middleware/uploadImage.js";

const MAX_DIMENSION = 1600; // px, longest side
const WEBP_QUALITY = 80;

// Resizes (only if larger than MAX_DIMENSION, never upscales) and re-encodes
// an uploaded image buffer to WebP, then writes it to the community uploads
// directory. Returns the filename to store on the Thread document.
// Re-encoding to WebP at quality 80 typically cuts file size by 60-80%
// compared to the original JPEG/PNG upload, with no visible quality loss at
// the sizes this platform actually displays images.
export const processAndSaveImage = async (buffer) => {
  const filename = `${crypto.randomBytes(16).toString("hex")}.webp`;
  const outputPath = path.join(COMMUNITY_UPLOAD_DIR, filename);

  await sharp(buffer)
    .rotate() // auto-orient based on EXIF, then strip EXIF on output
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  return filename;
};

export const deleteImage = async (filename) => {
  const filePath = path.join(COMMUNITY_UPLOAD_DIR, filename);
  await fs.unlink(filePath).catch(() => {}); // ignore if already gone
};
