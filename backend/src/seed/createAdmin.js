import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

// Bootstraps the first (or resets an existing) admin account. This is
// intentionally the ONLY way a user gets the "admin" role — there is no
// public registration path or self-service upgrade to admin. Once at least
// one admin exists, further role changes go through the Admin Panel's user
// management screen (PATCH /api/admin/users/:id/role), which itself
// requires an existing admin session.
const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before running this script.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email }).select("+password");
  if (user) {
    user.name = name;
    user.password = password; // re-hashed by the pre-save hook since it's modified
    user.role = "admin";
    user.isEmailVerified = true;
    await user.save();
    console.log(`Existing user ${email} updated to admin.`);
  } else {
    user = await User.create({
      name,
      email,
      password,
      role: "admin",
      isEmailVerified: true,
      authProvider: "local",
    });
    console.log(`Admin account created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Admin seed failed:", err);
  process.exit(1);
});
