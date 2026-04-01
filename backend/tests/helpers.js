import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { createApp } from "../config/app.js";
import { Category } from "../models/Category.js";
import { Booking } from "../models/Booking.js";
import { Otp } from "../models/Otp.js";
import { Payment } from "../models/Payment.js";
import { Provider } from "../models/Provider.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";

export let mongoServer;
export const app = createApp();

export const setupDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

export const teardownDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearDatabase = async () => {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Service.deleteMany({}),
    Provider.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Otp.deleteMany({}),
    RefreshToken.deleteMany({}),
  ]);
};

export const createUserAndLogin = async (overrides = {}) => {
  const payload = {
    name: "Test User",
    email: `user${Date.now()}@test.com`,
    password: "Password@123",
    phone: `9999${String(Date.now()).slice(-6)}`,
    role: "customer",
    ...overrides,
  };

  await request(app).post("/api/auth/register").send(payload);
  await User.findOneAndUpdate({ email: payload.email }, { emailVerified: true });
  const loginResponse = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  return { payload, response: loginResponse };
};

export const seedProviderFixture = async () => {
  const category = await Category.create({
    name: `Plumber-${Date.now()}`,
    description: "Plumbing services",
  });
  const service = await Service.create({
    name: "Pipe Repair",
    categoryId: category._id,
    description: "Fix leaks",
    basePrice: 499,
    duration: 60,
  });
  const user = await User.create({
    name: "Provider User",
    email: `provider${Date.now()}@test.com`,
    password: "Password@123",
    phone: `8888${String(Date.now()).slice(-6)}`,
    role: "provider",
    emailVerified: true,
  });
  const provider = await Provider.create({
    userId: user._id,
    servicesOffered: [service._id],
    rating: 4.8,
    totalReviews: 10,
    experienceYears: 5,
    isVerified: true,
    location: {
      type: "Point",
      coordinates: [77.391, 28.6139],
      address: "Sector 62, Noida",
    },
  });

  return { category, service, user, provider };
};
