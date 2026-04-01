import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import xss from "xss-clean";
import { env } from "./env.js";
import authRoutes from "../routes/authRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import serviceRoutes from "../routes/serviceRoutes.js";
import providerRoutes from "../routes/providerRoutes.js";
import buildBookingRoutes from "../routes/bookingRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import testRoutes from "../routes/testRoutes.js";
import { errorHandler, notFound } from "../middleware/errorMiddleware.js";
import { logger } from "./logger.js";

const requestLogger = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createApp = (io) => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || !env.corsOrigins.length || env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(requestLogger);
  app.use("/api", apiLimiter);
  app.use("/api/auth", authLimiter);
  app.use(`/${env.uploadDir}`, express.static(path.resolve(env.uploadDir)));

  app.get("/health", (_req, res) => res.json({ success: true, message: "Servify API is running" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/providers", providerRoutes);
  app.use("/api/bookings", buildBookingRoutes(io));
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/test", testRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
