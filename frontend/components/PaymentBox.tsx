import { Banknote, Mail, MessageCircle, Upload } from "lucide-react";
import { paymentOptions, site } from "@/lib/site";

export function PaymentBox() {
  const jazzcash = paymentOptions.jazzcash;
  const easypaisa = paymentOptions.easypaisa;
  const bank = paymentOptions.bank;
  const email = site.contactEmail;
  const whatsapp = paymentOptions.whatsapp;

  return (
    <section className="result-panel payment-box" id="payment-options">
      <p className="eyebrow">Paid report MVP</p>
      <h2>Full PDF report option</h2>
      <p>
        Free scan shows a limited summary and two charts. For a full report, send payment manually and share your payment
        screenshot or reference on email/WhatsApp. Admin can then provide an unlock code.
      </p>
      <div className="feature-list">
        <div className="feature-row">
          <Banknote size={18} aria-hidden="true" />
          <span>JazzCash: {jazzcash}</span>
        </div>
        <div className="feature-row">
          <Banknote size={18} aria-hidden="true" />
          <span>Easypaisa: {easypaisa}</span>
        </div>
        <div className="feature-row">
          <Banknote size={18} aria-hidden="true" />
          <span>{bank}</span>
        </div>
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
        <a className="button primary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
          <MessageCircle size={18} aria-hidden="true" />
          Request full report
        </a>
        <a className="button secondary" href={`mailto:${email}?subject=ReportDoctor.pk full report request`}>
          <Mail size={18} aria-hidden="true" />
          Email payment proof
        </a>
      </div>
      <div className="field">
        <label htmlFor="payment-proof">Payment screenshot placeholder</label>
        <input id="payment-proof" type="file" accept="image/*,.pdf" />
      </div>
      <p className="muted">
        MVP note: this placeholder does not upload payment proof yet. Connect it to your form backend, WhatsApp link, or CRM
        when you go live.
      </p>
      <p className="muted">
        <Upload size={16} aria-hidden="true" /> Screenshot bhejein, unlock code hasil karein, phir full PDF download karein.
      </p>
    </section>
  );
}
