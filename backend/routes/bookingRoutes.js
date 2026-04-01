import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getProviderBookings,
  getUserBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { bookingCreateSchema, bookingStatusSchema } from "../validations/bookingValidation.js";

const buildBookingRoutes = (io) => {
  const router = Router();

  router.post("/", protect, authorize("customer"), validateRequest(bookingCreateSchema), createBooking(io));
  router.get("/user", protect, authorize("customer"), getUserBookings);
  router.get("/provider", protect, authorize("provider"), getProviderBookings);
  router.put("/:id/status", protect, authorize("provider", "admin"), validateRequest(bookingStatusSchema), updateBookingStatus(io));
  router.delete("/:id", protect, deleteBooking);

  return router;
};

export default buildBookingRoutes;
