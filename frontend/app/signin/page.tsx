import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false
  }
};

export default function SignInPage() {
  return (
    <Suspense fallback={<section className="auth-shell"><div className="auth-card">Loading...</div></section>}>
      <SignInForm />
    </Suspense>
  );
}
