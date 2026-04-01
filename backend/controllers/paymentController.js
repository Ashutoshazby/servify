import { StatusCodes } from "http-status-codes";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { getRazorpayClient, verifyRazorpaySignature } from "../services/razorpayService.js";
import { User } from "../models/User.js";
import { sendNotification } from "../services/notificationService.js";
import { logger } from "../config/logger.js";

export const createOrder = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId);
  if (!booking) throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");

  const order = await getRazorpayClient().orders.create({
    amount: Math.round(booking.price * 100),
    currency: "INR",
    receipt: `booking_${booking._id}`
  });

  const payment = await Payment.create({
    bookingId: booking._id,
    userId: booking.userId,
    amount: booking.price,
    orderId: order.id,
    paymentStatus: "created",
  });
  logger.info("Payment order created", { bookingId: booking._id, orderId: order.id, amount: booking.price });

  res.status(StatusCodes.CREATED).json({ success: true, data: { order, payment } });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });

  if (!isValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Payment verification failed");
  }

  const payment = await Payment.findOneAndUpdate(
    { orderId },
    { paymentId, signature, paymentStatus: "paid" },
    { new: true }
  );
  if (!payment) throw new ApiError(StatusCodes.NOT_FOUND, "Payment record not found");

  await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "paid", status: "accepted" });
  logger.info("Payment verified", { bookingId: payment.bookingId, orderId, paymentId });
  const user = await User.findById(payment.userId);
  await sendNotification({
    tokens: user?.deviceTokens,
    type: "payment_confirmation",
    data: { bookingId: String(payment.bookingId), paymentId: payment.paymentId },
  });

  res.json({ success: true, data: payment });
});

export const handlePaymentFailure = catchAsync(async (req, res) => {
  const payment = await Payment.findOneAndUpdate(
    { orderId: req.body.orderId },
    { paymentStatus: "failed", failureReason: req.body.reason },
    { new: true }
  );
  if (!payment) throw new ApiError(StatusCodes.NOT_FOUND, "Payment record not found");

  await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "failed", status: "cancelled" });
  logger.warn("Payment failed", { orderId: req.body.orderId, reason: req.body.reason });
  res.json({ success: true, data: payment });
});

export const refundPayment = catchAsync(async (req, res) => {
  const payment = await Payment.findOne({ paymentId: req.body.paymentId });
  if (!payment) throw new ApiError(StatusCodes.NOT_FOUND, "Payment record not found");

  let refundId = `mock_refund_${Date.now()}`;
  const client = getRazorpayClient();
  if (client.payments?.refund && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const refund = await client.payments.refund(payment.paymentId, {
      amount: req.body.amount ? Math.round(req.body.amount * 100) : undefined,
    });
    refundId = refund.id;
  }

  payment.refundId = refundId;
  payment.paymentStatus = "refunded";
  await payment.save();

  await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "refunded", status: "cancelled" });
  logger.info("Payment refunded", { paymentId: payment.paymentId, refundId });

  res.json({ success: true, data: payment });
});
