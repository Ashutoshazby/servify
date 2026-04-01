import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000
});

export const attachToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
};
