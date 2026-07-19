import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the access token sent in the Authorization header and attaches
// the authenticated user to req.user. Rejects the request with 401 if the
// token is missing, invalid, expired, or the user no longer exists.
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Restricts a route to specific roles, e.g. restrictTo("admin", "moderator")
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to perform this action" });
  }
  next();
};
