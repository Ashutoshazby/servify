import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, nonce: crypto.randomUUID() }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
