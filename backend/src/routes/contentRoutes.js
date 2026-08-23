import { Router } from "express";
import {
  getTracks,
  getTrackLessons,
  getLesson,
  listAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/contentController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Admin routes first — otherwise "/tracks/:track" would swallow "/admin/lessons"
// as if "admin" were a track slug (it isn't, so it'd 404 either way, but
// keeping admin routes explicit and first avoids any ambiguity).
router.get("/admin/lessons", protect, restrictTo("admin"), listAllLessons);
router.get("/admin/lessons/:id", protect, restrictTo("admin"), getLessonById);
router.post("/admin/lessons", protect, restrictTo("admin"), createLesson);
router.put("/admin/lessons/:id", protect, restrictTo("admin"), updateLesson);
router.delete("/admin/lessons/:id", protect, restrictTo("admin"), deleteLesson);

router.get("/tracks", getTracks);
router.get("/tracks/:track", getTrackLessons);
router.get("/tracks/:track/:slug", getLesson);

export default router;
