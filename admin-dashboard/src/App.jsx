import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ProvidersPage from "./pages/ProvidersPage";
import BookingsPage from "./pages/BookingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RatingsPage from "./pages/RatingsPage";
import ServicesPage from "./pages/ServicesPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAdminAuthStore } from "./store/authStore";

const navItems = [
  ["Dashboard", "/"],
  ["Users", "/users"],
  ["Providers", "/providers"],
  ["Services", "/services"],
  ["Bookings", "/bookings"],
  ["Payments", "/payments"],
  ["Analytics", "/analytics"],
  ["Ratings", "/ratings"]
];

export default function App() {
  const logout = useAdminAuthStore((state) => state.logout);
  const user = useAdminAuthStore((state) => state.user);

  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <div className="layout">
              <aside className="sidebar">
                <h1>Servify Admin</h1>
                <p>{user?.name}</p>
                {navItems.map(([label, to]) => (
                  <NavLink key={to} to={to} className="nav-link">
                    {label}
                  </NavLink>
                ))}
                <button className="btn" onClick={logout}>Logout</button>
              </aside>
              <main className="content">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/providers" element={<ProvidersPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/ratings" element={<RatingsPage />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
