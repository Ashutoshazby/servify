import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ["email", "phone"], required: true },
    target: { type: String, required: true, index: true },
    code: { type: String, required: true, select: false },
    purpose: {
      type: String,
      enum: ["register_verify", "login_verify", "password_reset"],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
