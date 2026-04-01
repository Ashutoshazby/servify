import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api, attachToken } from "../services/api";
import { registerForPushNotifications, syncDeviceToken } from "../services/notifications";

const getErrorMessage = (error, fallback) => {
  const details = error?.response?.data;
  if (typeof details?.message === "string" && details.message.trim()) {
    return details.message;
  }
  if (Array.isArray(details?.errors) && details.errors.length) {
    return details.errors.map((entry) => entry.message || entry).join(", ");
  }
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  return fallback;
};

const hydrateSession = async (set) => {
  const token = await SecureStore.getItemAsync("servify_access_token");
  const refreshToken = await SecureStore.getItemAsync("servify_refresh_token");
  if (token) {
    attachToken(token);
    try {
      const { data } = await api.get("/auth/me");
      set({ token, refreshToken, user: data.user, initialized: true });
      return;
    } catch (_error) {
      if (refreshToken) {
        try {
          const { data } = await api.post("/auth/refresh-token", { refreshToken });
          attachToken(data.accessToken);
          await SecureStore.setItemAsync("servify_access_token", data.accessToken);
          await SecureStore.setItemAsync("servify_refresh_token", data.refreshToken);
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
            initialized: true,
          });
          return;
        } catch (_err) {
          await SecureStore.deleteItemAsync("servify_access_token");
          await SecureStore.deleteItemAsync("servify_refresh_token");
        }
      }
    }
  }
  set({ initialized: true });
};

export const useAuthStore = create((set, get) => ({
  token: "",
  refreshToken: "",
  user: null,
  loading: false,
  error: "",
  initialized: false,
  bootstrap: async () => {
    await hydrateSession(set);
  },
  login: async (credentials) => {
    try {
      set({ loading: true, error: "" });
      const { data } = await api.post("/auth/login", credentials);
      attachToken(data.accessToken);
      await SecureStore.setItemAsync("servify_access_token", data.accessToken);
      await SecureStore.setItemAsync("servify_refresh_token", data.refreshToken);
      set({ token: data.accessToken, refreshToken: data.refreshToken, user: data.user, loading: false });
      const deviceToken = await registerForPushNotifications();
      if (deviceToken) {
        await syncDeviceToken(deviceToken);
      }
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Login failed. Please try again."),
      });
      throw error;
    }
  },
  register: async (payload) => {
    try {
      set({ loading: true, error: "" });
      const { data } = await api.post("/auth/register", payload);
      set({ loading: false });
      return data;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error, "Registration failed. Please try again."),
      });
      throw error;
    }
  },
  logout: async () => {
    if (get().refreshToken) {
      await api.post("/auth/logout", { refreshToken: get().refreshToken });
    }
    await SecureStore.deleteItemAsync("servify_access_token");
    await SecureStore.deleteItemAsync("servify_refresh_token");
    attachToken("");
    set({ token: "", refreshToken: "", user: null, error: "" });
  },
}));
