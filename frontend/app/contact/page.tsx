import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ReportDoctor.pk for full reports, business reporting help, payment proof, and support."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Send a file question or payment reference</h1>
          <p>
            Ask a question about a report, payment proof, spreadsheet structure, or template setup. Email support is
            available now while additional checkout and support options are prepared.
          </p>
        </div>
      </section>
      <section className="section two-column">
        <div className="form-panel">
          <form className="upload-form">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email or support contact</label>
              <input id="email" name="email" placeholder="name@example.com" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Tell us what report you need" />
            </div>
            <a className="button primary" href={`mailto:${site.contactEmail}`}>
              <Mail size={18} aria-hidden="true" />
              Email {site.contactEmail}
            </a>
          </form>
        </div>
        <div>
          <p className="eyebrow">Support</p>
          <h2>What to include</h2>
          <p className="section-intro">
            Mention your business mode, file type, expected report, and whether you already sent payment proof. Do not send
            highly sensitive files unless you are comfortable with the current launch privacy policy.
          </p>
        </div>
      </section>
    </>
  );
}
