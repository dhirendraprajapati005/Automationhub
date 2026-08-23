import { Router } from "express";
import { getStats, listUsers, updateUserRole, getAnalytics } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Every route here requires a valid admin session — applied once at the
// router level rather than repeated on each individual route.
router.use(protect, restrictTo("admin"));

router.get("/stats", getStats);
router.get("/analytics", getAnalytics);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
