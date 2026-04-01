import { Server } from "socket.io";
import { env } from "./env.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigins.length ? env.corsOrigins : [env.clientUrl, env.adminUrl].filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => socket.join(`user:${userId}`));
    socket.on("join:booking", (bookingId) => socket.join(`booking:${bookingId}`));
    socket.on("chat:message", (payload) => {
      io.to(`booking:${payload.bookingId}`).emit("chat:message", payload);
    });
  });

  return io;
};
