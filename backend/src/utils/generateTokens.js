import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

// Sets the refresh token as an httpOnly cookie so it can't be read by client JS (XSS protection).
// sameSite differs by environment: in production, the frontend (Vercel) and
// backend (Render) are genuinely different sites, so the cookie needs
// sameSite:"none" to be sent cross-site at all — which browsers only allow
// together with secure:true (HTTPS), which Render provides by default.
// In local dev, both run on "localhost" (same site, different ports), so
// "lax" is enough and keeps things simple without needing HTTPS locally.
export const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};