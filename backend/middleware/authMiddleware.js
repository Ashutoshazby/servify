import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Authentication required"));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists"));
    }
    if (user.isActive === false) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "User account is disabled"));
    }
    req.user = user;
    next();
  } catch (_error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
};

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
    }
    next();
  };

export const optionalProtect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    req.user = user || null;
  } catch (_error) {
    req.user = null;
  }
  next();
};
