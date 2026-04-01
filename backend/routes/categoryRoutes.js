import { Router } from "express";
import { getCategories, seedCategories } from "../controllers/categoryController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { cacheResponse } from "../middleware/cacheMiddleware.js";

const router = Router();

router.get("/", cacheResponse(5 * 60 * 1000), getCategories);
router.post("/seed", protect, authorize("admin"), seedCategories);

export default router;
