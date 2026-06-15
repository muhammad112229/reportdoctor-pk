import type { Metadata } from "next";
import { AdminOrdersClient } from "./AdminOrdersClient";

export const metadata: Metadata = {
  title: "Admin orders",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
