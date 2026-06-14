import type { Metadata } from "next";
import { SEOLanding } from "@/components/SEOLanding";
import { getSeoLandingBySlug } from "@/lib/seoLanding";

const page = getSeoLandingBySlug("excel-data-analyzer")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription
};

export default function ExcelDataAnalyzerPage() {
  return <SEOLanding page={page} />;
}
