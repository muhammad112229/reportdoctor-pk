"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileUp, Loader2, MessageCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { PaymentBox } from "@/components/PaymentBox";
import { paymentOptions } from "@/lib/site";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type ChartPayload = {
  id: string;
  title: string;
  plotly: {
    data: unknown[];
    layout: Record<string, unknown>;
  };
};

type ColumnProfile = {
  name: string;
  dtype: string;
  detected_type: string;
  missing: number;
  missing_percent: number;
  unique: number;
  sample_values: string[];
};

type AnalysisResult = {
  file_name: string;
  mode: string;
  is_full_report: boolean;
  dataset: {
    rows: number;
    columns: number;
    column_names: string[];
    sample_rows: Record<string, string | number | null>[];
  };
  columns: {
    numeric: string[];
    categorical: string[];
    date: string[];
    text: string[];
    profiles: ColumnProfile[];
    suggested_mappings: Record<string, string | null>;
  };
  quality: {
    duplicate_rows: number;
    missing_total: number;
    missing_by_column: { column: string; missing: number; missing_percent: number }[];
  };
  metrics: { label: string; value: string }[];
  charts: ChartPayload[];
  insights_en: string[];
  insights_roman_urdu: string[];
  recommendations: string[];
  beginner_guidance: string[];
  locked_features: string[];
};

const modes = [
  "General Data",
  "Sales Data",
  "Inventory Data",
  "Expense Data",
  "Customer Data",
  "Survey Data"
];

const MAX_UPLOAD_MB = 10;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function AnalyzerClient() {
  const { session, profile, availableCredits, refreshAccountData } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("General Data");
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [unlockCode, setUnlockCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const canDownloadPdf = useMemo(
    () => Boolean(file && (unlockCode.trim() || (session && availableCredits > 0))),
    [availableCredits, file, session, unlockCode]
  );
  const whatsappUrl = `https://wa.me/${paymentOptions.whatsapp}`;
  const showAdminUnlock = profile?.role === "admin";

  async function runAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setResult(null);

    if (!file) {
      setError("Please choose a CSV or Excel file first.");
      return;
    }
    if (!API_BASE) {
      setError("The analysis service is not configured. Please set NEXT_PUBLIC_API_URL and try again.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`This file is too large. Please upload a file up to ${MAX_UPLOAD_MB} MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("beginner_mode", String(beginnerMode));
    if (unlockCode.trim()) {
      formData.append("unlock_code", unlockCode.trim());
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }
      setResult(data);
      setStatus(data.is_full_report ? "Full report unlocked." : "Free scan complete. Full PDF section is locked.");
    } catch (caught) {
      setError(formatClientError(caught, "Analysis service is offline. Please try again in a moment."));
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }
    if (!API_BASE) {
      setError("The analysis service is not configured. Please set NEXT_PUBLIC_API_URL and try again.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`This file is too large. Please upload a file up to ${MAX_UPLOAD_MB} MB.`);
      return;
    }
    setError(null);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("beginner_mode", String(beginnerMode));
    if (unlockCode.trim()) {
      formData.append("unlock_code", unlockCode.trim());
    }

    if (!session && !unlockCode.trim()) {
      setError("Please sign in and use an available report credit to download the full PDF.");
      return;
    }
    if (session && availableCredits <= 0 && !unlockCode.trim()) {
      setError("No report credits available. Please buy a paid report plan first.");
      return;
    }

    setPdfLoading(true);
    try {
      const headers = new Headers();
      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }
      const response = await fetch(`${API_BASE}/report/pdf`, {
        method: "POST",
        headers,
        body: formData
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "PDF generation failed.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.[^.]+$/, "")}-reportdoctor-report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      const remainingCredits = response.headers.get("X-Remaining-Credits");
      if (remainingCredits !== null) {
        setStatus(`PDF generated successfully. Remaining report credits: ${remainingCredits}.`);
        await refreshAccountData();
      } else {
        setStatus("PDF generated successfully.");
      }
    } catch (caught) {
      setError(formatClientError(caught, "PDF service is offline. Please try again in a moment."));
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="analyzer-shell">
      <section className="form-panel">
        <div className="sample-downloads" aria-label="Sample file downloads">
          <a className="sample-button" href="/sample-data/sales_sample.csv" download>
            <FileSpreadsheet size={18} aria-hidden="true" />
            Download Sales Sample CSV
          </a>
          <a className="sample-button" href="/sample-data/inventory_sample.csv" download>
            <FileSpreadsheet size={18} aria-hidden="true" />
            Download Inventory Sample CSV
          </a>
          <a className="sample-button" href="/sample-data/survey_sample.csv" download>
            <FileSpreadsheet size={18} aria-hidden="true" />
            Download Survey Sample CSV
          </a>
        </div>
        <form className="upload-form" onSubmit={runAnalysis}>
          <div className="field upload-field">
            <label htmlFor="file">Upload CSV, XLSX, or XLS file</label>
            <input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <span className="muted">Choose a spreadsheet up to {MAX_UPLOAD_MB} MB. Files are processed in memory for this MVP.</span>
            <span className="privacy-warning">
              Please do not upload highly sensitive personal, banking, or confidential files.
            </span>
          </div>

          <div className="field">
            <label htmlFor="mode">Business mode</label>
            <select id="mode" value={mode} onChange={(event) => setMode(event.target.value)}>
              {modes.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox-label" htmlFor="beginner">
            <input
              id="beginner"
              type="checkbox"
              checked={beginnerMode}
              onChange={(event) => setBeginnerMode(event.target.checked)}
            />
            Beginner Mode: column mapping aur simple guidance dikhayein
          </label>

          {showAdminUnlock ? (
            <details className="admin-fallback">
              <summary>Admin unlock-code fallback</summary>
              <div className="field">
                <label htmlFor="unlock">Paid report unlock code</label>
                <input
                  id="unlock"
                  type="text"
                  value={unlockCode}
                  onChange={(event) => setUnlockCode(event.target.value)}
                  placeholder="Enter admin fallback code"
                />
              </div>
            </details>
          ) : null}

          {session ? (
            <div className="status-box">
              Available report credits: {availableCredits}. PDF download consumes 1 credit.
            </div>
          ) : (
            <div className="status-box">
              Free Scan works without login. Sign in and buy credits to download full PDFs.
            </div>
          )}

          <div className="form-actions">
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <FileUp size={18} aria-hidden="true" />}
              {loading ? "Analyzing" : "Generate Free Report"}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={downloadPdf}
              disabled={!canDownloadPdf || pdfLoading}
            >
              {pdfLoading ? <Loader2 className="spin" size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
              {pdfLoading ? "Generating" : pdfButtonLabel(Boolean(session), availableCredits, Boolean(unlockCode.trim()))}
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                setResult(null);
                setStatus(null);
                setError(null);
              }}
            >
              <RefreshCcw size={18} aria-hidden="true" />
              Reset
            </button>
          </div>
        </form>
      </section>

      {status ? <div className="status-box">{status}</div> : null}
      {error ? <div className="status-box error">{error}</div> : null}

      {result ? (
        <section className="result-stack">
          <div className="result-panel">
            <p className="eyebrow">{result.is_full_report ? "Full report" : "Free scan"}</p>
            <h2>{result.file_name}</h2>
            <div className="metric-grid">
              <div className="metric">
                <span>Rows</span>
                <strong>{result.dataset.rows.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Columns</span>
                <strong>{result.dataset.columns.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Missing cells</span>
                <strong>{result.quality.missing_total.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Duplicate rows</span>
                <strong>{result.quality.duplicate_rows.toLocaleString()}</strong>
              </div>
            </div>
            <div className="badge-row">
              <span className="badge">Numeric: {result.columns.numeric.length}</span>
              <span className="badge">Categorical: {result.columns.categorical.length}</span>
              <span className="badge">Date: {result.columns.date.length}</span>
              <span className="badge">Text: {result.columns.text.length}</span>
            </div>
          </div>

          {beginnerMode ? (
            <div className="result-panel">
              <p className="eyebrow">Beginner Mode</p>
              <h2>Column mapping help</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Suggested column</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.columns.suggested_mappings).map(([field, value]) => (
                      <tr key={field}>
                        <td>{field}</td>
                        <td>{value || "Not detected"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="insight-list">
                {result.beginner_guidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="result-panel">
            <p className="eyebrow">Columns</p>
            <h2>Detected data profile</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Missing</th>
                    <th>Unique</th>
                    <th>Sample values</th>
                  </tr>
                </thead>
                <tbody>
                  {result.columns.profiles.map((column) => (
                    <tr key={column.name}>
                      <td>{column.name}</td>
                      <td>{column.detected_type}</td>
                      <td>
                        {column.missing} ({column.missing_percent}%)
                      </td>
                      <td>{column.unique}</td>
                      <td>{column.sample_values.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.metrics.length ? (
            <div className="result-panel">
              <p className="eyebrow">Business summary</p>
              <h2>{result.mode}</h2>
              <div className="metric-grid">
                {result.metrics.map((metric) => (
                  <div className="metric" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="chart-grid">
            {result.charts.map((chart) => (
              <article className="chart-card" key={chart.id}>
                <h3>{chart.title}</h3>
                <Plot
                  data={chart.plotly.data}
                  layout={{ ...chart.plotly.layout, autosize: true, margin: { t: 24, r: 18, b: 56, l: 54 } }}
                  useResizeHandler
                  style={{ width: "100%", height: 360 }}
                  config={{ displayModeBar: false, responsive: true }}
                />
              </article>
            ))}
          </div>

          <div className="insight-grid">
            <div className="result-panel">
              <p className="eyebrow">Insights</p>
              <h2>Plain English</h2>
              <ul className="insight-list">
                {result.insights_en.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="result-panel">
              <p className="eyebrow">Roman Urdu</p>
              <h2>Asaan zubaan</h2>
              <ul className="insight-list">
                {result.insights_roman_urdu.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="result-panel">
            <p className="eyebrow">Recommendations</p>
            <h2>Next steps</h2>
            <ul className="insight-list">
              {result.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {!result.is_full_report ? (
            <>
              <div className="result-panel">
                <p className="eyebrow">Locked in free scan</p>
                <h2>Full report includes</h2>
                <p className="section-intro">
                  Full PDF report chahiye? Pricing page se plan choose karein, Easypaisa payment karein, aur WhatsApp
                  par screenshot bhejein.
                </p>
                <ul className="insight-list">
                  {result.locked_features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="hero-actions">
                  <a className="button primary" href="/pricing">
                    Buy Report Credits
                  </a>
                  <a className="button secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle size={18} aria-hidden="true" />
                    Send Payment Screenshot
                  </a>
                </div>
              </div>
              <PaymentBox />
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function pdfButtonLabel(isSignedIn: boolean, credits: number, hasUnlockCode: boolean) {
  if (hasUnlockCode) {
    return "Download PDF";
  }
  if (isSignedIn && credits > 0) {
    return "Download PDF (use 1 credit)";
  }
  if (isSignedIn) {
    return "No credits available";
  }
  return "Sign in to unlock PDF";
}

function formatClientError(caught: unknown, fallback: string) {
  if (caught instanceof TypeError) {
    return fallback;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return fallback;
}
