import { Router } from "express";
import { getTracks, getTrackLessons, getLesson } from "../controllers/contentController.js";

const router = Router();

router.get("/tracks", getTracks);
router.get("/tracks/:track", getTrackLessons);
router.get("/tracks/:track/:slug", getLesson);

export default router;
