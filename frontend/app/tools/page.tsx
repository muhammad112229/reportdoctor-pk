import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolPages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Excel and CSV Report Tools",
  description:
    "Browse ReportDoctor.pk tools for Excel/CSV analysis, sales reports, inventory reports, missing values, duplicates, survey analysis, and PDF reports."
};

export default function ToolsPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Tools</p>
          <h1>Excel and CSV report tools</h1>
          <p>
            Start with a free data scan, then choose a focused report mode for sales, inventory, surveys, missing values,
            duplicates, or PDF reports.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="card-grid">
          {toolPages.map((tool) => (
            <article className="tool-card" key={tool.slug}>
              <p className="eyebrow">{tool.eyebrow}</p>
              <h2>{tool.title}</h2>
              <p>{tool.summary}</p>
              <div className="badge-row">
                {tool.useCases.slice(0, 3).map((useCase) => (
                  <span className="badge" key={useCase}>
                    {useCase}
                  </span>
                ))}
              </div>
              <div className="card-footer">
                <Link className="button primary" href={`/tools/${tool.slug}`}>
                  Open Tool
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

