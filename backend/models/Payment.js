import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    orderId: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    signature: { type: String, default: "" },
    refundId: { type: String, default: "" },
    failureReason: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created"
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Payment = mongoose.model("Payment", paymentSchema);
