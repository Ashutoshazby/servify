import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = process.env.NODE_ENV === "production" ? "" : "dev_jwt_secret";
}

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/servify",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:8081",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5173",
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean),
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "admin@servify.app",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123",
};
