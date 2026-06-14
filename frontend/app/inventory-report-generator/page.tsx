import type { Metadata } from "next";
import { SEOLanding } from "@/components/SEOLanding";
import { getSeoLandingBySlug } from "@/lib/seoLanding";

const page = getSeoLandingBySlug("inventory-report-generator")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription
};

export default function InventoryReportGeneratorSeoPage() {
  return <SEOLanding page={page} />;
}
