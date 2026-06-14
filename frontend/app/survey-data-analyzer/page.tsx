import type { Metadata } from "next";
import { SEOLanding } from "@/components/SEOLanding";
import { getSeoLandingBySlug } from "@/lib/seoLanding";

const page = getSeoLandingBySlug("survey-data-analyzer")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription
};

export default function SurveyDataAnalyzerSeoPage() {
  return <SEOLanding page={page} />;
}
