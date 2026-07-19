import { Router } from "express";
import { listWiringDiagrams, getWiringDiagram } from "../controllers/wiringDiagramController.js";

const router = Router();
router.get("/", listWiringDiagrams);
router.get("/:slug", getWiringDiagram);

export default router;
