import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>{site.name}</strong>
        <p>{site.tagline}</p>
        <p className="muted">Turn spreadsheets into dashboards, diagnosis, insights, and client-ready PDF reports.</p>
        <p className="muted">Reports are analytical support and should be reviewed before financial, legal, or professional decisions.</p>
      </div>
      <div className="footer-grid">
        <div>
          <h3>Product</h3>
          <Link href="/free-scan">Data Analyzer</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/templates">Templates</Link>
        </div>
        <div>
          <h3>Learn</h3>
          <Link href="/sample-reports">Sample Reports</Link>
          <Link href="/learn">Blog</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <h3>Legal</h3>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Disclaimer</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
