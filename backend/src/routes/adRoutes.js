import { Router } from "express";
import { getAdForPlacement, recordClick, listAllAds, createAd, updateAd, deleteAd } from "../controllers/adController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/admin/all", protect, restrictTo("admin"), listAllAds);
router.post("/", protect, restrictTo("admin"), createAd);
router.put("/:id", protect, restrictTo("admin"), updateAd);
router.delete("/:id", protect, restrictTo("admin"), deleteAd);

router.get("/:placement", getAdForPlacement);
router.post("/:id/click", recordClick);

export default router;
