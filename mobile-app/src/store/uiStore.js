import { create } from "zustand";

export const useUiStore = create((set) => ({
  loading: false,
  loadingMessage: "Please wait...",
  error: "",
  setLoading: (loading, loadingMessage = "Please wait...") => set({ loading, loadingMessage }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: "" }),
}));
