import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import { Provider } from "../models/Provider.js";
import { Review } from "../models/Review.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const getDashboardStats = catchAsync(async (_req, res) => {
  const [users, providers, bookings, revenue, reviews, services] = await Promise.all([
    User.countDocuments(),
    Provider.countDocuments(),
    Booking.countDocuments(),
    Payment.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Review.countDocuments(),
    Service.countDocuments()
  ]);

  res.json({
    success: true,
    data: {
      users,
      providers,
      bookings,
      services,
      reviews,
      revenue: revenue[0]?.total || 0
    }
  });
});

export const getUsers = catchAsync(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

export const getUserDetails = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  res.json({ success: true, data: user });
});

export const disableUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  res.json({ success: true, data: user });
});

export const getProvidersAdmin = catchAsync(async (_req, res) => {
  const providers = await Provider.find()
    .populate("userId", "name email phone isActive")
    .populate("servicesOffered")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: providers });
});

export const getProviderAdminDetails = catchAsync(async (req, res) => {
  const provider = await Provider.findById(req.params.id).populate("userId servicesOffered");
  if (!provider) throw new ApiError(StatusCodes.NOT_FOUND, "Provider not found");
  res.json({ success: true, data: provider });
});

export const approveProvider = catchAsync(async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true })
    .populate("userId servicesOffered");
  if (!provider) throw new ApiError(StatusCodes.NOT_FOUND, "Provider not found");
  res.json({ success: true, data: provider });
});

export const getBookingsAdmin = catchAsync(async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const bookings = await Booking.find(query)
    .populate("userId", "name email phone")
    .populate({
      path: "providerId",
      populate: { path: "userId", select: "name email phone" },
    })
    .populate("serviceId")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

export const getBookingAdminDetails = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate({
      path: "providerId",
      populate: { path: "userId", select: "name email phone" },
    })
    .populate("serviceId");
  if (!booking) throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  res.json({ success: true, data: booking });
});

export const getTransactions = catchAsync(async (_req, res) => {
  const payments = await Payment.find().populate("bookingId userId").sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
});
