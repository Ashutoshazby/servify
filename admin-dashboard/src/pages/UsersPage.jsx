import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section>
      <h2>Manage Users</h2>
      <div className="split-grid">
        <div className="card">
          {users.map((user) => (
            <div key={user._id} className="row">
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <div className="actions">
                <button className="btn" onClick={async () => setSelectedUser((await api.get(`/admin/users/${user._id}`)).data.data)}>View</button>
                {!user.isActive ? null : <button className="btn danger" onClick={async () => { await api.patch(`/admin/users/${user._id}/disable`); await loadUsers(); }}>Disable</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>User Details</h3>
          {selectedUser ? (
            <>
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Phone: {selectedUser.phone}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Status: {selectedUser.isActive ? "Active" : "Disabled"}</p>
            </>
          ) : (
            <p>Select a user to inspect.</p>
          )}
        </div>
      </div>
    </section>
  );
}
