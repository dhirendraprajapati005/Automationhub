import { Router } from "express";
import { listPosts, getPost, listAllPosts, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/:type", listPosts);
router.get("/:type/admin/all", protect, restrictTo("admin"), listAllPosts);
router.get("/:type/:slug", getPost);
router.post("/:type", protect, restrictTo("admin"), createPost);
router.put("/:type/:id", protect, restrictTo("admin"), updatePost);
router.delete("/:type/:id", protect, restrictTo("admin"), deletePost);

export default router;
