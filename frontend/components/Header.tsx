"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { site } from "@/lib/site";

const nav = [
  { href: "/tools", label: "Tools" },
  { href: "/sample-reports", label: "Sample Reports" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/learn", label: "Learn" }
];

export function Header() {
  const router = useRouter();
  const { session, loading, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label={`${site.name} home`}>
        <span className="brand-mark">
          <img src="/logo-mark.svg" alt="" aria-hidden="true" />
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
      <div className="nav-actions">
        <Link className="nav-cta" href="/free-scan">
          Free Scan
        </Link>
        {!loading && session ? (
          <>
            <Link className="nav-link" href="/dashboard">
              Dashboard
            </Link>
            <button className="nav-link button-reset" type="button" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/signin">
              Sign in
            </Link>
            <Link className="nav-link strong" href="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
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
          {!loading && session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button className="mobile-nav-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin">Sign in</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
        </div>
      </details>
    </header>
  );
}
