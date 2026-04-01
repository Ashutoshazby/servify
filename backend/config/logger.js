import fs from "fs";
import path from "path";
import winston from "winston";
import { env } from "./env.js";

const logDir = path.resolve("backend", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: env.nodeEnv === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
  ],
});
