"use client";

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  Download,
  FileSpreadsheet,
  FileText,
  FileUp,
  LayoutDashboard,
  Loader2,
  Lock,
  MessageCircle,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
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

type DataDoctorDiagnosis = {
  score: number;
  severity: string;
  summary: string;
  diagnosis: string;
  risk: string;
  impact: string;
  prescription: string[];
  risks: string[];
  missing_summary: string;
  duplicate_summary: string;
  weak_columns: string[];
  outlier_warnings: { column: string; count: number; message: string }[];
  inconsistent_values: { column: string; count: number; message: string }[];
  is_limited?: boolean;
};

type BusinessHealthScore = {
  score: number | null;
  grade: string;
  mode: string;
  explanation: string;
  main_risks: string[];
  opportunities: string[];
  recommended_actions: string[];
};

type SmartDashboard = {
  kpis: { label: string; value: string }[];
  recommended_charts: { id: string; title: string; reason: string }[];
  layout_hint: string;
  chart_strategy: string[];
  is_limited: boolean;
  summary: string;
};

type AskMyData = {
  suggestions: string[];
  answers: Record<string, string>;
  unsupported_message: string;
};

type ConsultantReport = {
  executive_summary: string[];
  key_findings: string[];
  risks: string[];
  opportunities: string[];
  recommended_actions: string[];
  data_quality_notes: string[];
  chart_explanations: { id: string; title: string; reason: string }[];
  simple_language_summary: string;
  next_30_day_action_plan: string[];
  is_limited?: boolean;
};

type FeatureAccess = {
  is_full_report: boolean;
  upgrade_message: string;
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
  chart_explanations?: { id: string; title: string; reason: string }[];
  data_doctor_diagnosis: DataDoctorDiagnosis;
  business_health_score: BusinessHealthScore | null;
  smart_dashboard: SmartDashboard;
  ask_my_data: AskMyData;
  consultant_report: ConsultantReport;
  feature_access: FeatureAccess;
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
const ALLOWED_UPLOAD_EXTENSIONS = [".csv", ".xlsx", ".xls"];
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
  const [dataQuestion, setDataQuestion] = useState("");
  const [dataAnswer, setDataAnswer] = useState<string | null>(null);
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
    const fileError = validateSelectedFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (!API_BASE) {
      setError("The analysis service is not configured. Please contact support or try again later.");
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
      setDataQuestion("");
      setDataAnswer(null);
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
    const fileError = validateSelectedFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (!API_BASE) {
      setError("The PDF service is not configured. Please contact support or try again later.");
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
      setError("Please sign in and use an available report credit to download the full consultant PDF.");
      return;
    }
    if (session && availableCredits <= 0 && !unlockCode.trim()) {
      setError("No report credits available. Start with a paid plan to unlock the full dashboard, AI consultant report, and PDF.");
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
            <label className="upload-title" htmlFor="file">
              <FileUp size={22} aria-hidden="true" />
              Upload CSV, XLSX, or XLS file
            </label>
            <input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <span className="muted">Choose a spreadsheet up to {MAX_UPLOAD_MB} MB. Files are processed for analysis.</span>
            <span className="privacy-warning">
              Raw files are not sent to external AI by default. Avoid highly sensitive personal, banking, medical, or legal files unless you are comfortable.
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
              Free Scan works without login. Sign in and buy credits to unlock full consultant PDFs.
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
                setDataQuestion("");
                setDataAnswer(null);
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

          <nav className="premium-tabs" aria-label="Report sections">
            <a href="#overview"><LayoutDashboard size={16} aria-hidden="true" /> Overview</a>
            <a href="#smart-dashboard"><Activity size={16} aria-hidden="true" /> Smart Dashboard</a>
            <a href="#data-diagnosis"><Stethoscope size={16} aria-hidden="true" /> Data Diagnosis</a>
            <a href="#charts"><Sparkles size={16} aria-hidden="true" /> Charts</a>
            <a href="#ai-consultant"><Brain size={16} aria-hidden="true" /> AI Consultant</a>
            <a href="#pdf-report"><FileText size={16} aria-hidden="true" /> PDF Report</a>
          </nav>

          <section className="result-panel premium-panel" id="overview">
            <div className="panel-toolbar">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>AI-style report snapshot</h2>
              </div>
              {!result.is_full_report ? <span className="status-pill pending">Free preview</span> : <span className="status-pill approved">Full report</span>}
            </div>
            <div className="score-grid">
              <div className="score-card">
                <Stethoscope size={22} aria-hidden="true" />
                <span>Data Health Score</span>
                <strong>{result.data_doctor_diagnosis.score}/100</strong>
                <em>{result.data_doctor_diagnosis.severity}</em>
              </div>
              <div className="score-card">
                <Activity size={22} aria-hidden="true" />
                <span>Business Health Score</span>
                <strong>{result.business_health_score?.score ?? "N/A"}</strong>
                <em>{result.business_health_score?.grade || "Needs business columns"}</em>
              </div>
              <div className="score-card">
                <Brain size={22} aria-hidden="true" />
                <span>Consultant mode</span>
                <strong>{result.consultant_report.is_limited ? "Preview" : "Full"}</strong>
                <em>Rule-based AI consultant</em>
              </div>
            </div>
            <p className="section-intro">{result.consultant_report.simple_language_summary}</p>
            {!result.is_full_report ? <UpgradeNotice message={result.feature_access.upgrade_message} /> : null}
          </section>

          <section className="result-panel premium-panel" id="smart-dashboard">
            <div className="panel-toolbar">
              <div>
                <p className="eyebrow">Smart Dashboard</p>
                <h2>Recommended KPI and chart layout</h2>
              </div>
              {result.smart_dashboard.is_limited ? <span className="status-pill pending">Limited preview</span> : null}
            </div>
            <p className="section-intro">{result.smart_dashboard.summary}</p>
            <div className="metric-grid">
              {result.smart_dashboard.kpis.map((metric) => (
                <div className="metric" key={`${metric.label}-${metric.value}`}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
            <div className="consultant-grid">
              <div>
                <h3>Recommended charts</h3>
                <ul className="insight-list">
                  {result.smart_dashboard.recommended_charts.map((chart) => (
                    <li key={chart.id}><strong>{chart.title}:</strong> {chart.reason}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Chart strategy</h3>
                <ul className="insight-list">
                  {result.smart_dashboard.chart_strategy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="result-panel premium-panel" id="data-diagnosis">
            <div className="panel-toolbar">
              <div>
                <p className="eyebrow">Data Doctor Diagnosis</p>
                <h2>Diagnosis, risk, impact, prescription</h2>
              </div>
              <span className={`health-badge ${severityClass(result.data_doctor_diagnosis.severity)}`}>
                {result.data_doctor_diagnosis.severity}
              </span>
            </div>
            <div className="diagnosis-grid">
              <div><span>Diagnosis</span><strong>{result.data_doctor_diagnosis.diagnosis}</strong></div>
              <div><span>Risk</span><strong>{result.data_doctor_diagnosis.risk}</strong></div>
              <div><span>Impact</span><strong>{result.data_doctor_diagnosis.impact}</strong></div>
            </div>
            <div className="feature-list">
              <div className="feature-row"><ShieldCheck size={18} aria-hidden="true" /><span>{result.data_doctor_diagnosis.missing_summary}</span></div>
              <div className="feature-row"><ShieldCheck size={18} aria-hidden="true" /><span>{result.data_doctor_diagnosis.duplicate_summary}</span></div>
              <div className="feature-row"><ShieldCheck size={18} aria-hidden="true" /><span>Weak columns: {result.data_doctor_diagnosis.weak_columns.length ? result.data_doctor_diagnosis.weak_columns.join(", ") : "None detected"}</span></div>
              <div className="feature-row"><ShieldCheck size={18} aria-hidden="true" /><span>Outliers: {result.data_doctor_diagnosis.outlier_warnings.length ? result.data_doctor_diagnosis.outlier_warnings.map((item) => item.message).join(" ") : "None detected"}</span></div>
            </div>
            <h3>Prescription</h3>
            <ul className="insight-list">
              {result.data_doctor_diagnosis.prescription.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="result-panel premium-panel" id="ai-consultant">
            <div className="panel-toolbar">
              <div>
                <p className="eyebrow">AI Consultant</p>
                <h2>Ask My Data and consultant report</h2>
              </div>
              <span className="status-pill approved">No paid AI API required</span>
            </div>
            <div className="ask-panel">
              <div>
                <h3>Ask My Data</h3>
                <p className="muted">Ask about totals, trends, top categories, missing values, duplicates, and data quality.</p>
              </div>
              <form
                className="ask-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setDataAnswer(answerDataQuestion(result, dataQuestion));
                }}
              >
                <input value={dataQuestion} onChange={(event) => setDataQuestion(event.target.value)} placeholder="Example: What is the data health score?" />
                <button className="button primary" type="submit"><Send size={16} aria-hidden="true" /> Ask</button>
              </form>
              <div className="suggestion-row">
                {result.ask_my_data.suggestions.slice(0, 5).map((question) => (
                  <button
                    className="suggestion-chip"
                    type="button"
                    key={question}
                    onClick={() => {
                      setDataQuestion(question);
                      setDataAnswer(answerDataQuestion(result, question));
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
              {dataAnswer ? <div className="assistant-answer"><Brain size={18} aria-hidden="true" /><span>{dataAnswer}</span></div> : null}
            </div>
            <div className="consultant-grid">
              <ConsultantList title="Executive summary" items={result.consultant_report.executive_summary} />
              <ConsultantList title="Key findings" items={result.consultant_report.key_findings} />
              <ConsultantList title="Risks" items={result.consultant_report.risks} />
              <ConsultantList title="Opportunities" items={result.consultant_report.opportunities} />
              <ConsultantList title="Recommended actions" items={result.consultant_report.recommended_actions} />
              <ConsultantList title="Next 30-day action plan" items={result.consultant_report.next_30_day_action_plan} />
            </div>
          </section>

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

          <div className="chart-grid" id="charts">
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
              <p className="eyebrow">Simple guidance</p>
              <h2>Plain-language notes</h2>
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
                <h2 id="pdf-report">Unlock the full AI consultant PDF</h2>
                <p className="section-intro">
                  {result.feature_access.upgrade_message} Choose a paid plan to unlock the full dashboard, AI consultant
                  report, action plan, and PDF. International checkout coming soon; manual local verification is available now.
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

function answerDataQuestion(result: AnalysisResult, question: string) {
  const normalized = question.trim().toLowerCase().replace(/[?!.]/g, "");
  if (!normalized) {
    return "Ask a question about totals, trends, top categories, missing values, duplicates, or data quality.";
  }

  const direct = result.ask_my_data.answers[normalized];
  if (direct) {
    return direct;
  }

  const match = Object.entries(result.ask_my_data.answers).find(([key]) => {
    const cleanKey = key.toLowerCase();
    return normalized.includes(cleanKey) || cleanKey.includes(normalized);
  });
  return match?.[1] || result.ask_my_data.unsupported_message;
}

function validateSelectedFile(file: File) {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_UPLOAD_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
  if (!hasAllowedExtension) {
    return "Unsupported file type. Please upload a CSV, XLSX, or XLS spreadsheet.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `This file is too large. Please upload a spreadsheet up to ${MAX_UPLOAD_MB} MB.`;
  }
  if (file.size === 0) {
    return "This file is empty. Please choose a spreadsheet with rows and columns.";
  }
  return null;
}

function UpgradeNotice({ message }: { message: string }) {
  return (
    <div className="upgrade-panel">
      <Lock size={18} aria-hidden="true" />
      <span>{message}</span>
      <a className="button secondary" href="/pricing">Unlock full report</a>
    </div>
  );
}

function ConsultantList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="consultant-card">
      <h3>{title}</h3>
      <ul className="insight-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function severityClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
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
    if (/unsupported file type/i.test(caught.message)) {
      return "Unsupported file type. Please upload a CSV, XLSX, or XLS spreadsheet.";
    }
    if (/too large/i.test(caught.message)) {
      return `This file is too large. Please upload a spreadsheet up to ${MAX_UPLOAD_MB} MB.`;
    }
    if (/no report credits/i.test(caught.message)) {
      return "No report credits available. Start with a paid plan to unlock the full consultant PDF.";
    }
    if (/could not analyze|corrupted|invalid|no readable rows|no usable rows/i.test(caught.message)) {
      return `${caught.message} If the issue continues, export a fresh CSV or XLSX copy and try again.`;
    }
    return caught.message || fallback;
  }
  return fallback;
}
