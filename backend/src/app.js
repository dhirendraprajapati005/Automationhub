import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import aiAssistantRoutes from "./routes/aiAssistantRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import wiringDiagramRoutes from "./routes/wiringDiagramRoutes.js";
import faultRoutes from "./routes/faultRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { getSitemap } from "./controllers/sitemapController.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// --- Security & parsing middleware ---
// crossOriginResourcePolicy relaxed to "cross-origin" because community
// images are served from this API's origin but rendered on the frontend's
// own origin/port — the default "same-origin" policy would silently block them.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow the httpOnly refresh cookie to be sent
  })
);
app.use(express.json({ limit: "10kb" })); // body size limit guards against payload abuse
app.use(cookieParser());
app.use(mongoSanitize()); // strips Mongo operators ($gt, $ne, etc.) from input to prevent NoSQL injection

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Global rate limiter as a baseline; authRoutes applies a stricter one on top
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// Community thread images are publicly viewable directly by URL. Downloads
// are deliberately NOT exposed this way — they go through the counted,
// filename-restoring /api/downloads/:id/file route instead.
app.use("/uploads/community", express.static(path.resolve("uploads", "community")));

// --- Routes ---
app.get("/sitemap.xml", getSitemap);
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wiring-diagrams", wiringDiagramRoutes);
app.use("/api/faults", faultRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/newsletter", newsletterRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
