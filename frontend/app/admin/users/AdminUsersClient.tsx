"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "../AdminGate";
import { useAuth } from "@/components/AuthProvider";
import type { Profile } from "@/lib/accountTypes";
import { fetchJson } from "@/lib/api";

type AdminUser = Profile & {
  available_credits: number;
};

export function AdminUsersClient() {
  const { session } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchJson<{ users: AdminUser[] }>("/admin/users", session)
      .then((data) => setUsers(data.users))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load users."));
  }, [session]);

  return (
    <AdminGate>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Admin users</p>
          <h1>User profiles</h1>
          <p>Review customer contact details, roles, and current credit balances.</p>
        </div>
      </section>
      <section className="section">
        {error ? <div className="status-box error">{error}</div> : null}
        <div className="result-panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Role</th>
                <th>Credits</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name || "No name"}</td>
                  <td>{user.email}</td>
                  <td>{user.whatsapp || "Not added"}</td>
                  <td><span className="status-pill">{user.role}</span></td>
                  <td>{user.available_credits}</td>
                  <td>{user.created_at ? formatDate(user.created_at) : "-"}</td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td colSpan={6}>No users found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminGate>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(new Date(value));
}
