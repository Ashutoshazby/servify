import { StatusCodes } from "http-status-codes";
import { Review } from "../models/Review.js";
import { Provider } from "../models/Provider.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createReview = catchAsync(async (req, res) => {
  const review = await Review.create({ ...req.body, userId: req.user._id });
  const reviews = await Review.find({ providerId: review.providerId });
  const rating = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

  await Provider.findByIdAndUpdate(review.providerId, {
    rating: Number(rating.toFixed(1)),
    totalReviews: reviews.length
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: review });
});

export const getProviderReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ providerId: req.params.id })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});
