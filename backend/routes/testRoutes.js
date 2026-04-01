import { Router } from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { sendTestNotification } from "../controllers/testController.js";

const router = Router();

router.post("/send-notification", protect, authorize("admin", "customer", "provider"), sendTestNotification);

export default router;
