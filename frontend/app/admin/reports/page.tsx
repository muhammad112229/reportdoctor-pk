import type { Metadata } from "next";
import { AdminReportsClient } from "./AdminReportsClient";

export const metadata: Metadata = {
  title: "Admin reports",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminReportsPage() {
  return <AdminReportsClient />;
}
