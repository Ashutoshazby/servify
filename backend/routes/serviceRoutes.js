import { Router } from "express";
import {
  createService,
  deleteService,
  getServices,
  updateService
} from "../controllers/serviceController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { cacheResponse } from "../middleware/cacheMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { serviceSchema } from "../validations/serviceValidation.js";

const router = Router();

router.get("/", cacheResponse(5 * 60 * 1000), getServices);
router.post("/", protect, authorize("admin"), validateRequest(serviceSchema), createService);
router.put("/:id", protect, authorize("admin"), validateRequest(serviceSchema), updateService);
router.delete("/:id", protect, authorize("admin"), deleteService);

export default router;
