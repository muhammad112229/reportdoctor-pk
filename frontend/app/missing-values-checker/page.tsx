import type { Metadata } from "next";
import { SEOLanding } from "@/components/SEOLanding";
import { getSeoLandingBySlug } from "@/lib/seoLanding";

const page = getSeoLandingBySlug("missing-values-checker")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription
};

export default function MissingValuesCheckerSeoPage() {
  return <SEOLanding page={page} />;
}
