import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.js";
import { env } from "../config/env.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const parseExpiry = (value) => {
  const match = String(value).match(/^(\d+)([dhm])$/i);
  if (!match) return 1000 * 60 * 60 * 24 * 30;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;
  return amount * 24 * 60 * 60 * 1000;
};

export const issueAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + parseExpiry(env.jwtRefreshExpiresIn)),
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (token) => {
  const decoded = jwt.verify(token, env.jwtRefreshSecret);
  const stored = await RefreshToken.findOne({ token, revokedAt: null });
  if (!stored) return null;
  stored.revokedAt = new Date();
  await stored.save();
  return decoded;
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token, revokedAt: null }, { revokedAt: new Date() });
};
