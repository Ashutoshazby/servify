import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../utils/catchAsync.js";
import { sendNotification } from "../services/notificationService.js";

export const sendTestNotification = catchAsync(async (req, res) => {
  await sendNotification({
    tokens: [req.body.token],
    title: req.body.title || "Servify test",
    body: req.body.body || "This is a test notification.",
    data: req.body.data || {},
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Test notification request sent",
  });
});
