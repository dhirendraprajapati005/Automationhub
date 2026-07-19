import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitContactForm } from "../controllers/contactController.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: "Too many messages sent — please wait a while before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, submitContactForm);

export default router;
