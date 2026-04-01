import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

let transporter;

const hasSmtpConfig = () => Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const getTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return transporter;
};

export const sendOtpEmail = async ({ to, code, purpose }) => {
  const mailer = getTransporter();

  if (!mailer) {
    logger.warn("SMTP not configured. OTP email not sent.", { to, purpose });
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

  await mailer.sendMail({
    from: env.smtpFrom,
    to,
    subject: subjectMap[purpose] || "Your Servify OTP",
    text: `Your Servify OTP is ${code}. Use it to ${actionMap[purpose] || "continue"}. It expires in ${env.otpTtlMinutes} minutes.`,
    html: `<p>Your Servify OTP is <strong>${code}</strong>.</p><p>Use it to ${actionMap[purpose] || "continue"}. It expires in ${env.otpTtlMinutes} minutes.</p>`,
  });

  return true;
};
