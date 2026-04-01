import { Router } from "express";
import {
  approveProvider,
  disableUser,
  getBookingAdminDetails,
  getBookingsAdmin,
  getDashboardStats,
  getProviderAdminDetails,
  getProvidersAdmin,
  getTransactions,
  getUserDetails,
  getUsers,
} from "../controllers/adminController.js";
import { adminLogin, getAdminProfile } from "../controllers/authController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { adminLoginSchema } from "../validations/authValidation.js";

const router = Router();

router.post("/login", validateRequest(adminLoginSchema), adminLogin);
router.get("/me", protect, authorize("admin"), getAdminProfile);

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/disable", disableUser);
router.get("/providers", getProvidersAdmin);
router.get("/providers/:id", getProviderAdminDetails);
router.patch("/providers/:id/approve", approveProvider);
router.get("/bookings", getBookingsAdmin);
router.get("/bookings/:id", getBookingAdminDetails);
router.get("/transactions", getTransactions);

export default router;
