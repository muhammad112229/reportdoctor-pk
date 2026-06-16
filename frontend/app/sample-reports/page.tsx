import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { sampleReports } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sample Reports",
  description:
    "View sample PDF reports for sales, ecommerce, service operations, education, and inventory analysis."
};

export default function SampleReportsPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Sample reports</p>
          <h1>See what a ReportDoctor.pk report looks like</h1>
          <p>
            These starter examples show the structure: cover page, executive summary, data diagnosis, charts, insights,
            recommendations, action plan, and disclaimer.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="card-grid">
          {sampleReports.map((report) => (
            <article className="report-card" key={report.slug}>
              <h2>{report.title}</h2>
              <p>{report.description}</p>
              <div className="card-footer hero-actions">
                <Link className="button primary" href={`/sample-reports/${report.slug}`}>
                  View Page
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link className="button secondary" href={report.pdf}>
                  PDF
                  <Download size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
