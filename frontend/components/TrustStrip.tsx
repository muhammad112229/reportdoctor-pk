import { BadgeCheck, Lock, Sparkles } from "lucide-react";

export function TrustStrip() {
  const items = [
    { icon: Lock, label: "Files processed in memory for MVP" },
    { icon: BadgeCheck, label: "No signup for free scan" },
    { icon: Sparkles, label: "Beginner friendly guidance" }
  ];

  return (
    <section className="trust-strip" aria-label="Trust highlights">
      {items.map(({ icon: Icon, label }) => (
        <div key={label}>
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

