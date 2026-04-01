import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer"
    },
    profileImage: { type: String, default: "" },
    address: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    resetPasswordCode: { type: String, default: "", select: false },
    resetPasswordExpiresAt: { type: Date, default: null, select: false },
    deviceTokens: [{ type: String }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider" }]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
