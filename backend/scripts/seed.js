import { connectDB } from "../config/db.js";
import { seedDemoData } from "../services/seedService.js";

const main = async () => {
  await connectDB();
  await seedDemoData();

  console.log("Seed data created successfully");
  process.exit(0);
};

main().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
