import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Machine from "../models/Machine.js";
import Download from "../models/Download.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @route  GET /api/admin/stats
// @desc   Aggregate counts for the admin dashboard overview
const getStats = asyncHandler(async (req, res) => {
  const [userCount, lessonCount, machineCount, downloadCount, downloadAgg, roleAgg] = await Promise.all([
    User.countDocuments(),
    Lesson.countDocuments({ isPublished: true }),
    Machine.countDocuments({ isPublished: true }),
    Download.countDocuments({ isPublished: true }),
    Download.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
  ]);

  res.json({
    userCount,
    lessonCount,
    machineCount,
    downloadCount,
    totalFileDownloads: downloadAgg[0]?.total || 0,
    usersByRole: Object.fromEntries(roleAgg.map((r) => [r._id, r.count])),
  });
});

// @route  GET /api/admin/users
// @desc   List all users for management (paginated)
const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 25);

  const [users, total] = await Promise.all([
    User.find()
      .select("name email role isEmailVerified reputationPoints createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(),
  ]);

  res.json({ users, total, page, pages: Math.ceil(total / limit) });
});

// @route  PATCH /api/admin/users/:id/role
// @desc   Change a user's role (admin only — this is the only way a user
//         becomes an admin or moderator; there is no public self-service path)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "moderator", "admin"].includes(role)) {
    return res.status(400).json({ message: "Role must be user, moderator, or admin" });
  }

  // Prevent an admin from locking themselves out by demoting their own last-admin account
  if (String(req.user._id) === req.params.id && role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({ message: "Cannot demote the only remaining admin account" });
    }
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    "name email role isEmailVerified"
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
});

export { getStats, listUsers, updateUserRole };
