import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [status, setStatus] = useState("");

  const loadBookings = async (currentStatus = "") => {
    const { data } = await api.get("/admin/bookings", { params: currentStatus ? { status: currentStatus } : {} });
    setBookings(data.data);
  };

  useEffect(() => {
    loadBookings(status);
  }, [status]);

  return (
    <section>
      <h2>Manage Bookings</h2>
      <div className="toolbar">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="split-grid">
        <div className="card">
          {bookings.map((booking) => (
            <div key={booking._id} className="row">
              <div>
                <strong>{booking.serviceId?.name}</strong>
                <p>{booking.status}</p>
              </div>
              <button className="btn" onClick={async () => setSelectedBooking((await api.get(`/admin/bookings/${booking._id}`)).data.data)}>View</button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Booking Details</h3>
          {selectedBooking ? (
            <>
              <p>Customer: {selectedBooking.userId?.name}</p>
              <p>Provider: {selectedBooking.providerId?.userId?.name}</p>
              <p>Status: {selectedBooking.status}</p>
              <p>Payment: {selectedBooking.paymentStatus}</p>
              <p>Date: {selectedBooking.date} {selectedBooking.time}</p>
            </>
          ) : (
            <p>Select a booking to inspect.</p>
          )}
        </div>
      </div>
    </section>
  );
}
