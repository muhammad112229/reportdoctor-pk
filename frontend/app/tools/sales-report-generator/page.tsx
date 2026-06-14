import type { Metadata } from "next";
import { ToolLanding } from "@/components/ToolLanding";
import { getToolBySlug } from "@/lib/site";

const tool = getToolBySlug("sales-report-generator")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription
};

export default function SalesReportGeneratorPage() {
  return <ToolLanding tool={tool} />;
}

