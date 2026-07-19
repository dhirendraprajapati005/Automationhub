import { Router } from "express";
import { getMachines, getMachine } from "../controllers/machineController.js";

const router = Router();

router.get("/", getMachines);
router.get("/:slug", getMachine);

export default router;
