import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/admin/transactions").then(({ data }) => setPayments(data.data));
  }, []);

  return (
    <section>
      <h2>Payment Transactions</h2>
      <div className="card">
        {payments.map((payment) => (
          <div key={payment._id} className="row">
            <div>
              <strong>{payment.userId?.name || payment.userId?.email}</strong>
              <p>{payment.paymentStatus}</p>
            </div>
            <div>
              <strong>Rs. {payment.amount}</strong>
              <p>{payment.paymentId || payment.orderId}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
