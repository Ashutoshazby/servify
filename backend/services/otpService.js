import crypto from "crypto";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { Otp } from "../models/Otp.js";
import { sendOtpEmail } from "./emailService.js";

const hashCode = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const createOtp = async ({ target, channel, purpose }) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await Otp.deleteMany({ target, purpose, consumedAt: null });
  await Otp.create({
    target,
    channel,
    purpose,
    code: hashCode(code),
    expiresAt: new Date(Date.now() + env.otpTtlMinutes * 60 * 1000),
  });
  logger.info(`OTP generated for ${channel}:${target} purpose=${purpose} code=${code}`);
  if (channel === "email") {
    await sendOtpEmail({ to: target, code, purpose });
  }
  return code;
};

export const verifyOtp = async ({ target, purpose, code }) => {
  const otp = await Otp.findOne({ target, purpose, consumedAt: null }).select("+code");
  if (!otp) return false;
  if (otp.expiresAt < new Date()) return false;
  if (otp.code !== hashCode(code)) return false;
  otp.consumedAt = new Date();
  await otp.save();
  return true;
};
