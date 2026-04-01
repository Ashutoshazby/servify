import { create } from "zustand";
import { api } from "../services/api";

const getStoredState = () => {
  const token = localStorage.getItem("servify_admin_token") || "";
  const user = localStorage.getItem("servify_admin_user");
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const useAdminAuthStore = create((set) => ({
  ...getStoredState(),
  loading: false,
  initialized: false,
  bootstrap: async () => {
    const token = localStorage.getItem("servify_admin_token");
    if (!token) {
      set({ initialized: true });
      return;
    }

    try {
      const { data } = await api.get("/admin/me");
      set({ token, user: data.user, initialized: true });
    } catch (_error) {
      localStorage.removeItem("servify_admin_token");
      localStorage.removeItem("servify_admin_user");
      set({ token: "", user: null, initialized: true });
    }
  },
  login: async (credentials) => {
    set({ loading: true });
    const { data } = await api.post("/admin/login", credentials);
    localStorage.setItem("servify_admin_token", data.accessToken);
    localStorage.setItem("servify_admin_user", JSON.stringify(data.user));
    set({ token: data.accessToken, user: data.user, loading: false });
  },
  logout: () => {
    localStorage.removeItem("servify_admin_token");
    localStorage.removeItem("servify_admin_user");
    set({ token: "", user: null });
  },
}));
