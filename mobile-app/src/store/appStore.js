import { create } from "zustand";
import { api } from "../services/api";

export const useAppStore = create((set) => ({
  categories: [],
  services: [],
  providers: [],
  bookings: [],
  notifications: [],
  selectedCategory: null,
  selectedProvider: null,
  selectedService: null,
  selectedBookingDraft: null,
  selectedBooking: null,
  reviews: [],
  fetchCategories: async () => {
    const { data } = await api.get("/categories");
    set({ categories: data.data });
  },
  fetchServices: async (params = {}) => {
    const { data } = await api.get("/services", { params });
    set({ services: data.data });
  },
  fetchProviders: async (params = {}) => {
    const { data } = await api.get("/providers", { params });
    set({ providers: data.data });
  },
  fetchBookings: async (role = "customer") => {
    const endpoint = role === "provider" ? "/bookings/provider" : "/bookings/user";
    const { data } = await api.get(endpoint);
    set({ bookings: data.data });
  },
  fetchProviderById: async (providerId) => {
    const { data } = await api.get(`/providers/${providerId}`);
    set({ selectedProvider: data.data });
  },
  fetchReviews: async (providerId) => {
    const { data } = await api.get(`/reviews/provider/${providerId}`);
    set({ reviews: data.data });
  },
  setCategory: (category) => set({ selectedCategory: category }),
  setProvider: (provider) => set({ selectedProvider: provider }),
  setBookingDraft: (draft) => set((state) => ({ selectedBookingDraft: { ...state.selectedBookingDraft, ...draft } })),
  clearBookingDraft: () => set({ selectedBookingDraft: null }),
  createBooking: async (payload) => {
    const { data } = await api.post("/bookings", payload);
    set({ selectedBooking: data.data });
    return data.data;
  },
  updateBookingStatus: async (bookingId, status) => {
    const { data } = await api.put(`/bookings/${bookingId}/status`, { status });
    set((state) => ({
      bookings: state.bookings.map((booking) => (booking._id === bookingId ? data.data : booking)),
      selectedBooking: data.data,
    }));
    return data.data;
  },
  submitReview: async (payload) => {
    const { data } = await api.post("/reviews", payload);
    return data.data;
  },
  createPaymentOrder: async (bookingId) => {
    const { data } = await api.post("/payment/create-order", { bookingId });
    return data.data;
  },
  verifyPayment: async (payload) => {
    const { data } = await api.post("/payment/verify", payload);
    return data.data;
  },
  markPaymentFailure: async (payload) => {
    const { data } = await api.post("/payment/failure", payload);
    return data.data;
  },
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
}));
