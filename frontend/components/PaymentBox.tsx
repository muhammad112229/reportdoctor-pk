import { Banknote, Mail, MessageCircle, Upload } from "lucide-react";
import { paymentOptions, site } from "@/lib/site";

export function PaymentBox() {
  const jazzcash = paymentOptions.jazzcash;
  const easypaisa = paymentOptions.easypaisa;
  const bank = paymentOptions.bank;
  const email = site.contactEmail;
  const whatsapp = paymentOptions.whatsapp;
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <section className="result-panel payment-box" id="payment-options">
      <p className="eyebrow">Paid report MVP</p>
      <h2>Full PDF report option</h2>
      <p>
        Choose a paid report-credit plan to unlock the full dashboard, AI consultant report, action plan, and premium PDF.
      </p>
      <p className="muted">
        Manual Easypaisa and WhatsApp verification are temporary launch support options. International checkout coming soon.
      </p>
      <div className="feature-list">
        <div className="feature-row">
          <Banknote size={18} aria-hidden="true" />
          <span>Easypaisa: {easypaisa}</span>
        </div>
        {jazzcash ? (
          <div className="feature-row">
            <Banknote size={18} aria-hidden="true" />
            <span>JazzCash: {jazzcash}</span>
          </div>
        ) : null}
        {bank ? (
          <div className="feature-row">
            <Banknote size={18} aria-hidden="true" />
            <span>Bank transfer: {bank}</span>
          </div>
        ) : null}
        <div className="feature-row">
          <Mail size={18} aria-hidden="true" />
          <span>{email}</span>
        </div>
        <div className="feature-row">
          <MessageCircle size={18} aria-hidden="true" />
          <span>WhatsApp: +{whatsapp}</span>
        </div>
      </div>
      <div className="hero-actions">
        <a className="button primary" href="/pricing">
          Buy Report Credits
        </a>
        <a className="button secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} aria-hidden="true" />
          Send payment proof
        </a>
        <a className="button ghost" href={`mailto:${email}?subject=ReportDoctor.pk full report request`}>
          <Mail size={18} aria-hidden="true" />
          Email payment proof
        </a>
      </div>
      <div className="field">
        <label htmlFor="payment-proof">Payment proof placeholder</label>
        <input id="payment-proof" type="file" accept="image/*,.pdf" />
      </div>
      <p className="muted">
        <Upload size={16} aria-hidden="true" /> Send payment proof, wait for approval, then use your report credit to download the full PDF.
      </p>
    </section>
  );
}
