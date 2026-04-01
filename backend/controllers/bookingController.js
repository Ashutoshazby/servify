import { StatusCodes } from "http-status-codes";
import { Booking } from "../models/Booking.js";
import { Provider } from "../models/Provider.js";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { getPagination } from "../utils/pagination.js";
import { sendNotification } from "../services/notificationService.js";
import { logger } from "../config/logger.js";

const populateBooking = (query) =>
  query
    .populate("serviceId")
    .populate({
      path: "providerId",
      populate: { path: "userId", select: "name phone email profileImage" }
    })
    .populate("userId", "name phone email profileImage");

export const createBooking = (io) =>
  catchAsync(async (req, res) => {
    const booking = await Booking.create({ ...req.body, userId: req.user._id });
    logger.info("Booking created", { bookingId: booking._id, userId: req.user._id, providerId: booking.providerId });
    const provider = await Provider.findById(booking.providerId).populate("userId");
    const customer = await User.findById(req.user._id);

    io?.to(`user:${provider.userId._id}`).emit("booking:update", {
      type: "incoming_request",
      bookingId: booking._id
    });

    await sendNotification({
      tokens: provider?.userId?.deviceTokens,
      type: "booking_confirmation",
      title: "New booking request",
      body: "A customer has requested one of your services.",
      data: { bookingId: String(booking._id) }
    });

    await sendNotification({
      tokens: customer?.deviceTokens,
      type: "booking_confirmation",
      data: { bookingId: String(booking._id) },
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: booking });
  });

export const getUserBookings = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [bookings, total] = await Promise.all([
    populateBooking(Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Booking.countDocuments({ userId: req.user._id }),
  ]);
  res.json({ success: true, data: bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const getProviderBookings = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user._id });
  if (!provider) throw new ApiError(StatusCodes.NOT_FOUND, "Provider profile not found");

  const { page, limit, skip } = getPagination(req.query);
  const [bookings, total] = await Promise.all([
    populateBooking(Booking.find({ providerId: provider._id }).sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Booking.countDocuments({ providerId: provider._id }),
  ]);
  res.json({ success: true, data: bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const updateBookingStatus = (io) =>
  catchAsync(async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking) throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
    logger.info("Booking status updated", { bookingId: booking._id, status: booking.status, updatedBy: req.user._id });

    const customer = await User.findById(booking.userId);

    io?.to(`user:${booking.userId}`).emit("booking:update", {
      type: "status_changed",
      bookingId: booking._id,
      status: booking.status
    });

    await sendNotification({
      tokens: customer?.deviceTokens,
      type: booking.status === "accepted" ? "provider_acceptance" : "service_reminder",
      title: "Booking updated",
      body: `Your booking is now ${booking.status.replace("_", " ")}.`,
      data: { bookingId: String(booking._id), status: booking.status }
    });

    res.json({ success: true, data: booking });
  });

export const deleteBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  logger.info("Booking cancelled", { bookingId: booking._id, cancelledBy: req.user._id });
  res.json({ success: true, message: "Booking cancelled" });
});
