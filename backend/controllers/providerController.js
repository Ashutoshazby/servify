import { StatusCodes } from "http-status-codes";
import { Provider } from "../models/Provider.js";
import { Service } from "../models/Service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateDistanceKm } from "../services/mapsService.js";
import { getPagination } from "../utils/pagination.js";
import { logger } from "../config/logger.js";

export const getProviders = catchAsync(async (req, res) => {
  const { serviceId, categoryId, lng, lat, minRating, verified } = req.query;
  const { page, limit, skip } = getPagination(req.query);
  const query = {};
  if (serviceId) query.servicesOffered = serviceId;
  if (categoryId) {
    const services = await Service.find({ categoryId }).select("_id");
    query.servicesOffered = { $in: services.map((service) => service._id) };
  }
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (verified !== undefined) query.isVerified = verified === "true";

  const [providers, total] = await Promise.all([
    Provider.find(query)
    .skip(skip)
    .limit(limit)
    .populate("userId", "name email phone profileImage address")
    .populate("servicesOffered"),
    Provider.countDocuments(query),
  ]);

  const data =
    lng && lat
      ? providers.map((provider) => ({
          ...provider.toObject(),
          distanceKm: calculateDistanceKm(
            [Number(lng), Number(lat)],
            provider.location?.coordinates || [0, 0]
          ).toFixed(1)
        }))
      : providers;

  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getProviderById = catchAsync(async (req, res) => {
  const provider = await Provider.findById(req.params.id)
    .populate("userId", "name email phone profileImage address")
    .populate("servicesOffered");

  if (!provider) throw new ApiError(StatusCodes.NOT_FOUND, "Provider not found");
  res.json({ success: true, data: provider });
});

export const createProvider = catchAsync(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.userId && req.user?.role === "provider") {
    payload.userId = req.user._id;
  }
  const provider = await Provider.create(payload);
  res.status(StatusCodes.CREATED).json({ success: true, data: provider });
});

export const updateProvider = catchAsync(async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!provider) throw new ApiError(StatusCodes.NOT_FOUND, "Provider not found");
  logger.info("Provider updated", { providerId: provider._id, updatedBy: req.user?._id, isVerified: provider.isVerified });
  res.json({ success: true, data: provider });
});
