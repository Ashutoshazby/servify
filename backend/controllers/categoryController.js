import { StatusCodes } from "http-status-codes";
import { Category } from "../models/Category.js";
import { catchAsync } from "../utils/catchAsync.js";
import { defaultCategories } from "../utils/defaultData.js";
import { clearCacheByPrefix } from "../middleware/cacheMiddleware.js";

export const seedCategories = catchAsync(async (_req, res) => {
  const existing = await Category.countDocuments();
  if (!existing) {
    await Category.insertMany(
      defaultCategories.map((name) => ({
        name,
        description: `${name} experts near you`
      }))
    );
  }

  clearCacheByPrefix("/api/categories");
  res.status(StatusCodes.CREATED).json({ success: true, message: "Categories seeded" });
});

export const getCategories = catchAsync(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, data: categories });
});
