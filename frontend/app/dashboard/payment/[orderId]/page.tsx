import type { Metadata } from "next";
import { PaymentClient } from "./PaymentClient";

export const metadata: Metadata = {
  title: "Payment order",
  robots: {
    index: false,
    follow: false
  }
};

export default function PaymentPage() {
  return <PaymentClient />;
}
