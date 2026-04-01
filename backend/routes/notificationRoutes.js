import { Router } from "express";
import { sendTestNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/send", protect, sendTestNotification);

export default router;
