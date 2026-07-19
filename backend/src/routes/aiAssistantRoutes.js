import { Router } from "express";
import rateLimit from "express-rate-limit";
import { ask } from "../controllers/aiAssistantController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Each call costs real API usage, so this gets its own tighter limiter,
// separate from the general API rate limit.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: { message: "Too many requests to the AI Assistant — wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/ask", protect, aiLimiter, ask);

export default router;
