import { sendPushNotification } from "./fcmService.js";

export const notificationTemplates = {
  booking_confirmation: {
    title: "Booking confirmed",
    body: "Your service booking has been created successfully.",
  },
  provider_acceptance: {
    title: "Provider accepted",
    body: "Your provider has accepted the booking.",
  },
  service_reminder: {
    title: "Service reminder",
    body: "Your scheduled service is coming up soon.",
  },
  payment_confirmation: {
    title: "Payment confirmed",
    body: "Your payment has been received successfully.",
  },
};

export const sendNotification = async ({ tokens, type, data = {}, title, body }) => {
  const template = notificationTemplates[type] || {};
  return sendPushNotification({
    tokens,
    title: title || template.title || "Servify update",
    body: body || template.body || "You have a new update.",
    data,
  });
};
