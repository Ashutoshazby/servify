import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/authStore";

export default function AdminLoginPage() {
  const login = useAdminAuthStore((state) => state.login);
  const user = useAdminAuthStore((state) => state.user);
  const loading = useAdminAuthStore((state) => state.loading);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-shell">
      <form
        className="auth-card"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            setError("");
            await login(form);
          } catch (loginError) {
            setError(loginError?.response?.data?.message || "Unable to sign in.");
          }
        }}
      >
        <h1>Servify Admin</h1>
        <input placeholder="Admin email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" type="submit">{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
