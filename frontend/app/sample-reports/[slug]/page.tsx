import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { sampleReports } from "@/lib/site";

export function generateStaticParams() {
  return sampleReports.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = sampleReports.find((item) => item.slug === slug);
  if (!report) {
    return {};
  }
  return {
    title: report.title,
    description: report.description
  };
}

export default async function SampleReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = sampleReports.find((item) => item.slug === slug);
  if (!report) {
    notFound();
  }

  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Sample report</p>
          <h1>{report.title}</h1>
          <p>{report.description}</p>
          <div className="hero-actions">
            <Link className="button primary" href={report.pdf}>
              Download PDF
              <Download size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/free-scan">
              Create Your Report
            </Link>
          </div>
        </div>
      </section>
      <section className="section two-column">
        <div>
          <p className="eyebrow">Report structure</p>
          <h2>What this sample includes</h2>
          <p className="section-intro">
            The live PDF generator follows the same basic structure, then adapts recommendations to the uploaded file and
            selected business mode.
          </p>
        </div>
        <div className="feature-list">
          {["Dataset summary", "Data Doctor Diagnosis", "Charts", "Plain-language insights", "Recommended actions", "Disclaimer"].map(
            (item) => (
              <div className="feature-row" key={item}>
                <span>{item}</span>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
