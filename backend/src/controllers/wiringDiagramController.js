import WiringDiagram from "../models/WiringDiagram.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const listWiringDiagrams = asyncHandler(async (req, res) => {
  const diagrams = await WiringDiagram.find({ isPublished: true })
    .select("slug title category description tags order")
    .sort({ category: 1, order: 1 });
  res.json({ diagrams });
});

const getWiringDiagram = asyncHandler(async (req, res) => {
  const diagram = await WiringDiagram.findOne({ slug: req.params.slug, isPublished: true });
  if (!diagram) return res.status(404).json({ message: "Wiring diagram not found" });
  res.json({ diagram });
});

export { listWiringDiagrams, getWiringDiagram };
