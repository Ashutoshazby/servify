import axios from "axios";

const fallbackApiUrl = "https://servify-backend-abxg.onrender.com/api";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || fallbackApiUrl,
  timeout: 15000
});

export const attachToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
};
