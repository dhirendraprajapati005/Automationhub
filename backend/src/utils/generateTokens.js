import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

// Sets the refresh token as an httpOnly cookie so it can't be read by client JS (XSS protection)
export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
