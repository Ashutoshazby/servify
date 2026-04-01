import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    experienceYears: { type: Number, default: 0, min: 0 },
    bio: { type: String, default: "" },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      },
      address: { type: String, default: "" }
    },
    availabilitySchedule: [
      {
        day: String,
        slots: [String],
        isAvailable: { type: Boolean, default: true }
      }
    ],
    isVerified: { type: Boolean, default: false },
    earnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

providerSchema.index({ location: "2dsphere" });
providerSchema.index({ servicesOffered: 1, rating: -1, isVerified: 1 });

export const Provider = mongoose.model("Provider", providerSchema);
