import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayClient = null;

export const getRazorpayClient = () => {
  if (razorpayClient) {
    return razorpayClient;
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return {
      orders: {
        create: async () => {
          throw new Error("Razorpay credentials are not configured");
        },
      },
      payments: {
        refund: async () => {
          throw new Error("Razorpay credentials are not configured");
        },
      },
    };
  }

  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayClient;
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const digest = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
};
