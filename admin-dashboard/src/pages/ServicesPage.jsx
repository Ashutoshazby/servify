import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const initialForm = { name: "", categoryId: "", description: "", basePrice: 0, duration: 60 };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");

  const load = async () => {
    const [{ data: serviceData }, { data: categoryData }] = await Promise.all([
      api.get("/services"),
      api.get("/categories"),
    ]);
    setServices(serviceData.data);
    setCategories(categoryData.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/services/${editingId}`, form);
    } else {
      await api.post("/services", form);
    }
    setEditingId("");
    setForm(initialForm);
    await load();
  };

  return (
    <section>
      <h2>Manage Services</h2>
      <div className="split-grid">
        <form className="card form-card" onSubmit={submit}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Service name" />
          <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" />
          <input type="number" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: Number(event.target.value) })} placeholder="Base price" />
          <input type="number" value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} placeholder="Duration" />
          <button className="btn" type="submit">{editingId ? "Update Service" : "Create Service"}</button>
        </form>
        <div className="card">
          {services.map((service) => (
            <div key={service._id} className="row">
              <div>
                <strong>{service.name}</strong>
                <p>{service.categoryId?.name}</p>
              </div>
              <div className="actions">
                <button className="btn" onClick={() => { setEditingId(service._id); setForm({ name: service.name, categoryId: service.categoryId?._id || "", description: service.description || "", basePrice: service.basePrice, duration: service.duration }); }}>Edit</button>
                <button className="btn danger" onClick={async () => { await api.delete(`/services/${service._id}`); await load(); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
