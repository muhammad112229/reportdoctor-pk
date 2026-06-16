import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About ReportDoctor.pk, an AI-style data consultant for Excel and CSV reports, dashboards, diagnosis, and PDF deliverables."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">About</p>
          <h1>AI-style reports for people who do not live inside spreadsheets</h1>
          <p>
            ReportDoctor.pk is built for business owners, sellers, teams, researchers, and beginners who need practical
            reports without learning advanced data analysis first.
          </p>
        </div>
      </section>
      <section className="section two-column">
        <div>
          <p className="eyebrow">Mission</p>
          <h2>Make everyday data easier to understand</h2>
          <p className="section-intro">
            The product combines a search-friendly website with a working analysis backend. The launch focuses on privacy,
            clarity, reliable deterministic analysis, and manual payment support while international checkout is prepared.
          </p>
        </div>
        <div className="feature-list">
          {["Beginner-first language", "Business mode reports", "No paid services required", "SEO-ready website structure"].map(
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
