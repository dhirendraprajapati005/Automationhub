import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings);
router.put("/", protect, restrictTo("admin"), updateSettings);

export default router;
