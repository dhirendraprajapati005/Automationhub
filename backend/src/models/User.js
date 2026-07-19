import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Not required: users who sign in via Google never set a password
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    reputationPoints: {
      type: Number,
      default: 0,
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // OTP for email verification / passwordless login
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Hash password before save, only if it was modified
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const { _id, name, email, avatar, role, isEmailVerified, reputationPoints, createdAt } = this;
  return { id: _id, name, email, avatar, role, isEmailVerified, reputationPoints, createdAt };
};

const User = mongoose.model("User", userSchema);
export default User;
