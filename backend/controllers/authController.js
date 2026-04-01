import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";
import { issueAuthTokens, revokeRefreshToken, rotateRefreshToken } from "../services/tokenService.js";
import { createOtp, verifyOtp } from "../services/otpService.js";

const formatAuthResponse = async (user) => {
  const tokens = await issueAuthTokens(user);
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: { ...user.toObject(), password: undefined },
  };
};

const validateActiveUser = (user) => {
  if (user?.isActive === false) {
    throw new ApiError(StatusCodes.FORBIDDEN, "User account is disabled");
  }
};

const validateVerifiedUser = (user) => {
  if (user?.role !== "admin" && user?.emailVerified === false) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Verify your email before logging in");
  }
};

export const register = catchAsync(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
  }

  const user = await User.create(req.body);
  await createOtp({ target: user.email, channel: "email", purpose: "register_verify" });

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { ...user.toObject(), password: undefined },
    message: "Registration successful. Verify your email with the OTP sent."
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password, deviceToken } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }
  validateActiveUser(user);
  validateVerifiedUser(user);

  if (deviceToken && !user.deviceTokens.includes(deviceToken)) {
    user.deviceTokens.push(deviceToken);
    await user.save();
  }
  logger.info("User login", { userId: user._id, role: user.role });

  res.json({
    success: true,
    ...(await formatAuthResponse(user))
  });
});

export const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid admin credentials");
  }
  validateActiveUser(user);
  logger.info("Admin login", { userId: user._id });

  res.json({
    success: true,
    ...(await formatAuthResponse(user)),
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    await createOtp({ target: user.email, channel: "email", purpose: "password_reset" });
  }

  res.json({
    success: true,
    message: user
      ? "Password reset OTP sent to the registered email"
      : "If the email exists, reset instructions will be sent"
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isValid = await verifyOtp({ target: email, purpose: "password_reset", code });
  if (!isValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

export const refreshToken = catchAsync(async (req, res) => {
  const decoded = await rotateRefreshToken(req.body.refreshToken);
  if (!decoded) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
  }

  res.json({ success: true, ...(await formatAuthResponse(user)) });
});

export const logout = catchAsync(async (req, res) => {
  if (req.body.refreshToken) {
    await revokeRefreshToken(req.body.refreshToken);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

export const sendOtp = catchAsync(async (req, res) => {
  const { target, channel, purpose } = req.body;
  await createOtp({ target, channel, purpose });
  res.json({ success: true, message: "OTP sent successfully" });
});

export const verifyOtpCode = catchAsync(async (req, res) => {
  const { target, purpose, code } = req.body;
  const ok = await verifyOtp({ target, purpose, code });
  if (!ok) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP");
  }

  if (purpose === "register_verify") {
    const user = await User.findOne({
      $or: [{ email: target }, { phone: target }],
    });
    if (user) {
      if (user.email === target) user.emailVerified = true;
      if (user.phone === target) user.phoneVerified = true;
      await user.save();
    }
  }

  res.json({
    success: true,
    message: purpose === "register_verify" ? "Email verified successfully. Please log in." : "OTP verified successfully",
  });
});

export const registerDeviceToken = catchAsync(async (req, res) => {
  const { deviceToken } = req.body;
  if (!req.user.deviceTokens.includes(deviceToken)) {
    req.user.deviceTokens.push(deviceToken);
    await req.user.save();
  }
  res.json({ success: true, message: "Device token registered" });
});

export const getProfile = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const getAdminProfile = catchAsync(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(StatusCodes.FORBIDDEN, "Admin access required");
  }
  res.json({ success: true, user: req.user });
});
