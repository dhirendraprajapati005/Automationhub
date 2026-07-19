import Fault from "../models/Fault.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const listFaults = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;

  const faults = await Fault.find(filter)
    .select("slug symptom category description tags order")
    .sort({ category: 1, order: 1 });
  res.json({ faults });
});

const getFault = asyncHandler(async (req, res) => {
  const fault = await Fault.findOne({ slug: req.params.slug, isPublished: true });
  if (!fault) return res.status(404).json({ message: "Fault entry not found" });
  res.json({ fault });
});

export { listFaults, getFault };
