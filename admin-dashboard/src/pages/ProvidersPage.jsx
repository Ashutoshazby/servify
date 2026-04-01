import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const loadProviders = async () => {
    const { data } = await api.get("/admin/providers");
    setProviders(data.data);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <section>
      <h2>Manage Providers</h2>
      <div className="split-grid">
        <div className="card">
          {providers.map((provider) => (
            <div key={provider._id} className="row">
              <div>
                <strong>{provider.userId?.name}</strong>
                <p>{provider.userId?.email}</p>
              </div>
              <div className="actions">
                <button className="btn" onClick={async () => setSelectedProvider((await api.get(`/admin/providers/${provider._id}`)).data.data)}>View</button>
                {provider.isVerified ? null : <button className="btn" onClick={async () => { await api.patch(`/admin/providers/${provider._id}/approve`); await loadProviders(); }}>Approve</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Provider Details</h3>
          {selectedProvider ? (
            <>
              <p>Name: {selectedProvider.userId?.name}</p>
              <p>Rating: {selectedProvider.rating}</p>
              <p>Verified: {selectedProvider.isVerified ? "Yes" : "No"}</p>
              <p>Experience: {selectedProvider.experienceYears} years</p>
              <p>Services: {selectedProvider.servicesOffered?.map((service) => service.name).join(", ")}</p>
            </>
          ) : (
            <p>Select a provider to inspect.</p>
          )}
        </div>
      </div>
    </section>
  );
}
