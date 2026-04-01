import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data.data)).catch(() => setStats(null));
  }, []);

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="card-grid">
        {Object.entries(stats || { users: 0, providers: 0, bookings: 0, revenue: 0 }).map(([key, value]) => (
          <div key={key} className="card">
            <strong>{key}</strong>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
