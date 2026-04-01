import { catchAsync } from "../utils/catchAsync.js";
import { sendNotification } from "../services/notificationService.js";

export const sendTestNotification = catchAsync(async (req, res) => {
  await sendNotification({
    tokens: req.user.deviceTokens,
    type: req.body.type,
    title: req.body.title,
    body: req.body.body,
    data: req.body.data || {},
  });

  res.json({ success: true, message: "Notification queued" });
});
