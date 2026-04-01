import { Router } from "express";
import { uploadSingleFile } from "../controllers/uploadController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.post("/profile-image", protect, upload.single("file"), uploadSingleFile);
router.post("/service-image", protect, authorize("admin", "provider"), upload.single("file"), uploadSingleFile);

export default router;
