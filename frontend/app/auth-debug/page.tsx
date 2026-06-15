import type { Metadata } from "next";
import { AuthDebugClient } from "./AuthDebugClient";

export const metadata: Metadata = {
  title: "Auth debug",
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthDebugPage() {
  return <AuthDebugClient />;
}
