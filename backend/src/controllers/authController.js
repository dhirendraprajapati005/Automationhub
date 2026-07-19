import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/generateTokens.js";
import { generateOTP, sendOTPEmail } from "../utils/otp.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route  POST /api/auth/register
// @desc   Create a local account and send an OTP to verify the email
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const otp = generateOTP();
  const user = await User.create({
    name,
    email,
    password,
    otp: { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 },
  });

  await sendOTPEmail(email, otp);

  res.status(201).json({
    message: "Account created. Check your email for a verification code.",
    userId: user._id,
  });
});

// @route  POST /api/auth/verify-otp
// @desc   Verify email using the OTP sent at registration (or requested via /resend-otp)
const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select("+otp.code +otp.expiresAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.otp?.code || user.otp.code !== otp) {
    return res.status(400).json({ message: "Invalid verification code" });
  }
  if (user.otp.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Verification code expired, request a new one" });
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  await user.save();

  const accessToken = await issueSession(res, user);
  res.json({ message: "Email verified", user: user.toSafeObject(), accessToken });
});

// @route  POST /api/auth/resend-otp
const resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  user.otp = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };
  await user.save();

  await sendOTPEmail(user.email, otp);
  res.json({ message: "A new verification code has been sent" });
});

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || user.authProvider !== "local" || !(await user.comparePassword(password))) {
    // Same message for "no user" and "wrong password" so we don't leak which emails are registered
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (!user.isEmailVerified) {
    return res.status(403).json({ message: "Please verify your email before logging in", userId: user._id });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = await issueSession(res, user);
  res.json({ user: user.toSafeObject(), accessToken });
});

// @route  POST /api/auth/google
// @desc   Verify a Google ID token from the frontend and log the user in,
//         creating an account on first sign-in.
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "Missing Google ID token" });

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
      authProvider: "google",
      googleId: payload.sub,
      isEmailVerified: true,
    });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = await issueSession(res, user);
  res.json({ user: user.toSafeObject(), accessToken });
});

// @route  POST /api/auth/refresh
// @desc   Issue a new access token using the httpOnly refresh cookie
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ message: "Refresh token revoked" });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  res.json({ accessToken });
});

// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

// Helper: creates access + refresh tokens, persists the refresh token on the
// user, sets it as an httpOnly cookie, and returns the access token so the
// caller can include it in the JSON response body.
async function issueSession(res, user) {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  setRefreshTokenCookie(res, refreshToken);
  return accessToken;
}

export { register, verifyOTP, resendOTP, login, googleLogin, refresh, logout, getMe };
