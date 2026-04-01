import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
    promoCode: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ paymentStatus: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
