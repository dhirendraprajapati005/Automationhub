import { Router } from "express";
import rateLimit from "express-rate-limit";
import { subscribe } from "../controllers/newsletterController.js";

const router = Router();

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts — please wait a while before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/subscribe", subscribeLimiter, subscribe);

export default router;
