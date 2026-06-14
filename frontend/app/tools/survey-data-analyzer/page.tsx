import type { Metadata } from "next";
import { ToolLanding } from "@/components/ToolLanding";
import { getToolBySlug } from "@/lib/site";

const tool = getToolBySlug("survey-data-analyzer")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription
};

export default function SurveyDataAnalyzerPage() {
  return <ToolLanding tool={tool} />;
}

