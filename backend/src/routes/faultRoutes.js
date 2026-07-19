import { Router } from "express";
import { listFaults, getFault } from "../controllers/faultController.js";

const router = Router();
router.get("/", listFaults);
router.get("/:slug", getFault);

export default router;
