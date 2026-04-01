import { StatusCodes } from "http-status-codes";
import { logger } from "../config/logger.js";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = StatusCodes.NOT_FOUND;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  logger.error(error.message, {
    statusCode,
    details: error.details,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
};
