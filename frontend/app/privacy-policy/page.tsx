import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ReportDoctor.pk covering uploaded files, processing, contact data, and MVP limits."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p>Last updated: June 14, 2026</p>
        </div>
      </section>
      <section className="section article-body">
        <h2>Uploaded files</h2>
        <p>
          In the MVP, uploaded CSV and Excel files are processed in memory by the backend for analysis and PDF generation.
          The app is designed not to store uploaded files permanently unless a future deployment adds storage intentionally.
        </p>
        <h2>Contact and payment information</h2>
        <p>
          If you contact ReportDoctor.pk or send payment proof manually, your name, contact details, message, and reference
          information may be used to respond to your request and provide report support.
        </p>
        <h2>Sensitive data</h2>
        <p>
          Users should avoid uploading highly sensitive personal, medical, financial, or confidential records unless they
          have reviewed the deployment configuration, access controls, and retention policy.
        </p>
        <h2>Analytics and cookies</h2>
        <p>
          This starter MVP does not require paid analytics or tracking services. If analytics are added later, update this
          policy with the provider name, purpose, and opt-out details.
        </p>
        <h2>Data deletion</h2>
        <p>
          Since files are processed in memory by default, restarting the backend clears temporary processing state. If future
          storage is added, provide a direct deletion request process.
        </p>
      </section>
    </>
  );
}

