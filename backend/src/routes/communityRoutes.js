import { Router } from "express";
import {
  listThreads,
  createThread,
  getThread,
  addComment,
  toggleThreadLike,
  toggleFollow,
  deleteThread,
  deleteComment,
} from "../controllers/communityController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { uploadThreadImages } from "../middleware/uploadImage.js";

const router = Router();

router.get("/threads", listThreads);
router.post("/threads", protect, uploadThreadImages.array("images", 4), createThread);
router.get("/threads/:id", getThread);
router.delete("/threads/:id", protect, restrictTo("admin", "moderator"), deleteThread);

router.post("/threads/:id/comments", protect, addComment);
router.delete("/comments/:id", protect, restrictTo("admin", "moderator"), deleteComment);

router.post("/threads/:id/like", protect, toggleThreadLike);
router.post("/users/:id/follow", protect, toggleFollow);

export default router;
