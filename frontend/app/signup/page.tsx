import type { Metadata } from "next";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  robots: {
    index: false,
    follow: false
  }
};

export default function SignUpPage() {
  return <SignUpForm />;
}
