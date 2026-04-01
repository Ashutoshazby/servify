import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Category } from "../models/Category.js";
import { Provider } from "../models/Provider.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { defaultCategories } from "../utils/defaultData.js";

const main = async () => {
  await connectDB();

  const categories = await Promise.all(
    defaultCategories.map((name) =>
      Category.findOneAndUpdate(
        { name },
        { name, description: `${name} experts near you` },
        { upsert: true, new: true }
      )
    )
  );

  const adminPassword = await bcrypt.hash(env.defaultAdminPassword, 10);
  await User.findOneAndUpdate(
    { email: env.defaultAdminEmail },
    {
      name: "Servify Admin",
      email: env.defaultAdminEmail,
      password: adminPassword,
      phone: "9999999999",
      role: "admin",
      emailVerified: true,
    },
    { upsert: true }
  );

  const serviceDefinitions = [
    { name: "Pipe Leak Repair", category: "Plumber", basePrice: 499, duration: 60 },
    { name: "Fan Installation", category: "Electrician", basePrice: 699, duration: 90 },
    { name: "Deep Home Cleaning", category: "Cleaning", basePrice: 1499, duration: 180 },
    { name: "AC Inspection", category: "AC Repair", basePrice: 799, duration: 90 },
    { name: "Salon Grooming", category: "Salon at Home", basePrice: 999, duration: 75 },
  ];

  const services = [];
  for (const item of serviceDefinitions) {
    const category = categories.find((entry) => entry.name === item.category);
    const service = await Service.findOneAndUpdate(
      { name: item.name },
      {
        name: item.name,
        categoryId: category._id,
        description: `${item.name} by verified Servify professionals`,
        basePrice: item.basePrice,
        duration: item.duration,
      },
      { upsert: true, new: true }
    );
    services.push(service);
  }

  const sampleUsers = [
    {
      name: "Aarav Sharma",
      email: "provider1@servify.app",
      phone: "9000000001",
      role: "provider",
      address: "Sector 62, Noida",
    },
    {
      name: "Diya Patel",
      email: "provider2@servify.app",
      phone: "9000000002",
      role: "provider",
      address: "Sector 75, Noida",
    },
  ];

  for (let index = 0; index < sampleUsers.length; index += 1) {
    const item = sampleUsers[index];
    const hashedPassword = await bcrypt.hash("Provider@123", 10);
    const user = await User.findOneAndUpdate(
      { email: item.email },
      {
        ...item,
        password: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      { upsert: true, new: true }
    );

    await Provider.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        servicesOffered: [services[index]?._id, services[index + 2]?._id].filter(Boolean),
        rating: 4.5 + index * 0.2,
        totalReviews: 12 + index,
        experienceYears: 4 + index,
        bio: "Trusted home service expert on Servify.",
        isVerified: true,
        location: {
          type: "Point",
          coordinates: [77.391 + index * 0.01, 28.6139 + index * 0.01],
          address: item.address,
        },
        availabilitySchedule: [
          { day: "Monday", slots: ["09:00", "11:00", "15:00"], isAvailable: true },
          { day: "Wednesday", slots: ["10:00", "14:00", "17:00"], isAvailable: true },
        ],
      },
      { upsert: true, new: true }
    );
  }

  console.log("Seed data created successfully");
  process.exit(0);
};

main().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
