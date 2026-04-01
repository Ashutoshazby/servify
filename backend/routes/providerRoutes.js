import { Router } from "express";
import {
  createProvider,
  getProviderById,
  getProviders,
  updateProvider
} from "../controllers/providerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { providerQuerySchema, providerSchema } from "../validations/providerValidation.js";

const router = Router();

router.get("/", validateRequest(providerQuerySchema), getProviders);
router.get("/:id", getProviderById);
router.post("/", protect, authorize("admin", "provider"), validateRequest(providerSchema), createProvider);
router.put("/:id", protect, authorize("admin", "provider"), validateRequest(providerSchema), updateProvider);

export default router;
