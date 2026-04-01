import { Router } from "express";
import {
  createOrder,
  handlePaymentFailure,
  refundPayment,
  verifyPayment,
} from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createOrderSchema,
  paymentFailureSchema,
  refundSchema,
  verifyPaymentSchema,
} from "../validations/paymentValidation.js";

const router = Router();

router.post("/create-order", protect, authorize("customer"), validateRequest(createOrderSchema), createOrder);
router.post("/verify", protect, authorize("customer"), validateRequest(verifyPaymentSchema), verifyPayment);
router.post("/failure", protect, authorize("customer", "admin"), validateRequest(paymentFailureSchema), handlePaymentFailure);
router.post("/refund", protect, authorize("admin"), validateRequest(refundSchema), refundPayment);

export default router;
