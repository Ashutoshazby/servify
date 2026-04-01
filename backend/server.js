import http from "http";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./config/socket.js";
import { createApp } from "./config/app.js";
import { logger } from "./config/logger.js";
import { Category } from "./models/Category.js";
import { seedDemoData } from "./services/seedService.js";

const server = http.createServer();
const io = initializeSocket(server);
const app = createApp(io);
server.removeAllListeners("request");
server.on("request", app);

await connectDB();
if (env.autoSeedDemo) {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await seedDemoData();
    logger.info("Demo data seeded automatically");
  }
}
server.listen(env.port, () => {
  logger.info(`Servify backend listening on port ${env.port}`);
});
