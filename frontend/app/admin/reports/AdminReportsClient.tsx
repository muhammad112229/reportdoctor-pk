"use client";

import { useEffect, useState } from "react";
import { AdminGate } from "../AdminGate";
import { useAuth } from "@/components/AuthProvider";
import type { SavedReport } from "@/lib/accountTypes";
import { fetchJson } from "@/lib/api";

export function AdminReportsClient() {
  const { session } = useAuth();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchJson<{ reports: SavedReport[] }>("/admin/reports", session)
      .then((data) => setReports(data.reports))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load reports."));
  }, [session]);

  return (
    <AdminGate>
      <section className="page-hero portal-hero">
        <div>
          <p className="eyebrow">Admin reports</p>
          <h1>PDF unlock history</h1>
          <p>Audit recent paid PDF downloads and the users who generated them.</p>
        </div>
      </section>
      <section className="section portal-section">
        {error ? <div className="status-box error">{error}</div> : null}
        <div className="result-panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>User</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.filename}</td>
                  <td>{report.profile?.email || report.user_id || "Guest"}</td>
                  <td>{report.mode}</td>
                  <td>{report.pdf_unlocked ? "PDF unlocked" : "Free scan"}</td>
                  <td>{formatDate(report.created_at)}</td>
                </tr>
              ))}
              {!reports.length ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <strong>No reports found</strong>
                      <span>Paid PDF unlocks will appear here after customers use report credits.</span>
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
