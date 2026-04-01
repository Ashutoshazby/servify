import { StatusCodes } from "http-status-codes";
import { Service } from "../models/Service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { clearCacheByPrefix } from "../middleware/cacheMiddleware.js";

export const getServices = catchAsync(async (req, res) => {
  const { categoryId, search } = req.query;
  const query = {};

  if (categoryId) query.categoryId = categoryId;
  if (search) query.name = { $regex: search, $options: "i" };

  const services = await Service.find(query).populate("categoryId");
  res.json({ success: true, data: services });
});

export const createService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);
  clearCacheByPrefix("/api/services");
  res.status(StatusCodes.CREATED).json({ success: true, data: service });
});

export const updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  clearCacheByPrefix("/api/services");
  res.json({ success: true, data: service });
});

export const deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  clearCacheByPrefix("/api/services");
  res.json({ success: true, message: "Service deleted" });
});
