import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 15 },
    images: [{ type: String }]
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
