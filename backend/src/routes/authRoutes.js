import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  googleLogin,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Tighter limiter for brute-force-sensitive endpoints (login, OTP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
