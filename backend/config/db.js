import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", { message: error.message });
    process.exit(1);
  }
};
