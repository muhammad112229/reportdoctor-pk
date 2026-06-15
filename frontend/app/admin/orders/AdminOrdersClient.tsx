"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { AdminGate } from "../AdminGate";
import { useAuth } from "@/components/AuthProvider";
import type { Order } from "@/lib/accountTypes";
import { fetchJson } from "@/lib/api";

type OrdersResponse = {
  orders: Order[];
};

export function AdminOrdersClient() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending" || order.status === "sent_on_whatsapp"),
    [orders]
  );

  async function loadOrders() {
    if (!session) {
      return;
    }
    setError(null);
    try {
      const data = await fetchJson<OrdersResponse>("/admin/orders", session);
      setOrders(data.orders);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load admin orders.");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, [session]);

  async function approve(orderId: string) {
    if (!session) {
      return;
    }
    setBusyOrderId(orderId);
    try {
      await fetchJson(`/admin/orders/${orderId}/approve`, session, { method: "POST" });
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not approve order.");
    } finally {
      setBusyOrderId(null);
    }
  }

  async function reject(orderId: string) {
    if (!session) {
      return;
    }
    setBusyOrderId(orderId);
    try {
      await fetchJson(`/admin/orders/${orderId}/reject`, session, {
        method: "POST",
        body: JSON.stringify({ admin_note: notes[orderId] || "Payment screenshot could not be verified." })
      });
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reject order.");
    } finally {
      setBusyOrderId(null);
    }
  }

  return (
    <AdminGate>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Admin orders</p>
          <h1>Pending payment requests</h1>
          <p>Review Easypaisa payment screenshots sent on WhatsApp, then approve credits or reject with a note.</p>
        </div>
      </section>
      <section className="section">
        {error ? <div className="status-box error">{error}</div> : null}
        <div className="result-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>WhatsApp</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Admin note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.profile?.full_name || "No name"}</strong>
                      <span className="table-subtext">{order.profile?.email || order.user_id}</span>
                    </td>
                    <td>{order.profile?.whatsapp || "Not added"}</td>
                    <td>{order.plan?.name || order.plan_id}</td>
                    <td>Rs. {order.amount_pkr.toLocaleString()}</td>
                    <td><span className="status-pill">{order.status}</span></td>
                    <td>
                      <input
                        className="table-input"
                        value={notes[order.id] || ""}
                        onChange={(event) => setNotes((current) => ({ ...current, [order.id]: event.target.value }))}
                        placeholder="Reason if rejected"
                      />
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="button secondary" type="button" onClick={() => approve(order.id)} disabled={busyOrderId === order.id}>
                          {busyOrderId === order.id ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />}
                          Approve
                        </button>
                        <button className="button ghost danger" type="button" onClick={() => reject(order.id)} disabled={busyOrderId === order.id}>
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!pendingOrders.length ? (
                  <tr>
                    <td colSpan={7}>No pending orders.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminGate>
  );
}
