import http from "http";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./config/socket.js";
import { createApp } from "./config/app.js";
import { logger } from "./config/logger.js";

const server = http.createServer();
const io = initializeSocket(server);
const app = createApp(io);
server.removeAllListeners("request");
server.on("request", app);

await connectDB();
server.listen(env.port, () => {
  logger.info(`Servify backend listening on port ${env.port}`);
});
