import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io((process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", ""));
  }
  return socket;
};
