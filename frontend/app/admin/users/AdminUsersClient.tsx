"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Gift, Loader2, Search } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return users;
    }

    return users.filter((user) => {
      return [user.full_name, user.email, user.whatsapp, user.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(cleanQuery));
    });
  }, [query, users]);

  const loadUsers = useCallback(async () => {
    if (!session) {
      return;
    }
    setError(null);
    try {
      const data = await fetchJson<{ users: AdminUser[] }>("/admin/users", session);
      setUsers(data.users);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load users.");
    }
  }, [session]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function grantCredit(user: AdminUser, credits: number) {
    if (!session || !confirm(`Grant ${credits} report credit${credits === 1 ? "" : "s"} to ${user.email || user.full_name || "this user"}?`)) {
      return;
    }

    setBusyUserId(user.id);
    setError(null);
    setStatus(null);
    try {
      await fetchJson("/admin/users/grant-credit", session, {
        method: "POST",
        body: JSON.stringify({ user_id: user.id, credits })
      });
      setStatus(`${credits} report credit${credits === 1 ? "" : "s"} granted to ${user.email || "user"}.`);
      await loadUsers();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not grant credits.");
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <AdminGate>
      <section className="page-hero portal-hero">
        <div>
          <p className="eyebrow">Admin users</p>
          <h1>User profiles</h1>
          <p>Review customer contact details, roles, and current credit balances.</p>
        </div>
      </section>
      <section className="section portal-section">
        {error ? <div className="status-box error">{error}</div> : null}
        {status ? <div className="status-box">{status}</div> : null}
        <div className="panel-toolbar">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>Customers and credits</h2>
          </div>
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, WhatsApp, role"
            />
          </label>
        </div>
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
                <th>Grant credit</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.full_name || "No name"}</strong></td>
                  <td>{user.email || "No email"}</td>
                  <td>{user.whatsapp || "Not provided"}</td>
                  <td><span className="status-pill">{user.role}</span></td>
                  <td><strong>{user.available_credits}</strong></td>
                  <td>{user.created_at ? formatDate(user.created_at) : "-"}</td>
                  <td>
                    <div className="admin-actions">
                      {[1, 3, 10].map((credits) => (
                        <button
                          className="button ghost"
                          type="button"
                          key={credits}
                          onClick={() => grantCredit(user, credits)}
                          disabled={busyUserId === user.id}
                        >
                          {busyUserId === user.id ? <Loader2 className="spin" size={15} /> : <Gift size={15} />}
                          +{credits}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredUsers.length ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <strong>No users found</strong>
                      <span>Try a different search term or wait for new signups.</span>
                    </div>
                  </td>
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
