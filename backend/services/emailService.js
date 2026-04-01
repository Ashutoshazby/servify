import { Resend } from "resend";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

let resendClient;

const getResendClient = () => {
  if (!env.resendApiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }

  return resendClient;
};

export const sendOtpEmail = async ({ to, code, purpose }) => {
  const resend = getResendClient();

  if (!resend) {
    logger.warn("Resend not configured. OTP email not sent.", { to, purpose });
    return false;
  }

  const subjectMap = {
    register_verify: "Verify your Servify account",
    password_reset: "Reset your Servify password",
    login_verify: "Your Servify login OTP",
  };

  const actionMap = {
    register_verify: "verify your account",
    password_reset: "reset your password",
    login_verify: "complete your login",
  };

  await resend.emails.send({
    from: env.resendFrom,
    to,
    subject: subjectMap[purpose] || "Your Servify OTP",
    text: `Your Servify OTP is ${code}. Use it to ${actionMap[purpose] || "continue"}. It expires in ${env.otpTtlMinutes} minutes.`,
    html: `<p>Your Servify OTP is <strong>${code}</strong>.</p><p>Use it to ${actionMap[purpose] || "continue"}. It expires in ${env.otpTtlMinutes} minutes.</p>`,
  });

  return true;
};
