import { Router } from "express";
import { createReview, getProviderReviews } from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reviewSchema } from "../validations/reviewValidation.js";

const router = Router();

router.post("/", protect, authorize("customer"), validateRequest(reviewSchema), createReview);
router.get("/provider/:id", getProviderReviews);

export default router;
