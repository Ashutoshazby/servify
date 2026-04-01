import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  refreshToken,
  register,
  registerDeviceToken,
  resetPassword,
  sendOtp,
  verifyOtpCode,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.post("/refresh-token", validateRequest(refreshTokenSchema), refreshToken);
router.post("/logout", logout);
router.post("/send-otp", validateRequest(otpSchema), sendOtp);
router.post("/verify-otp", validateRequest(otpSchema), verifyOtpCode);
router.post("/device-token", protect, registerDeviceToken);
router.get("/me", protect, getProfile);

export default router;
