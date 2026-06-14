import Link from "next/link";
import { BarChart3, Menu } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { href: "/tools", label: "Tools" },
  { href: "/sample-reports", label: "Sample Reports" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/learn", label: "Learn" }
];

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label={`${site.name} home`}>
        <span className="brand-mark">
          <BarChart3 size={21} aria-hidden="true" />
        </span>
        <span>{site.name}</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="nav-cta" href="/free-scan">
        Free Scan
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <Menu size={21} />
        </summary>
        <div className="mobile-nav">
          {nav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/free-scan">Free Scan</Link>
        </div>
      </details>
    </header>
  );
}
