import Machine from "../models/Machine.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  GET /api/machines
// @desc   List all published machines, grouped implicitly by category
const getMachines = asyncHandler(async (req, res) => {
  const machines = await Machine.find({ isPublished: true })
    .select("slug title category summary tags order")
    .sort({ category: 1, order: 1 });

  res.json({ machines });
});

// @route  GET /api/machines/:slug
// @desc   Get one machine's full content
const getMachine = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const machine = await Machine.findOne({ slug, isPublished: true });
  if (!machine) {
    return res.status(404).json({ message: "Machine not found" });
  }

  res.json({ machine });
});

export { getMachines, getMachine };
