import type { Metadata } from "next";
import { ToolLanding } from "@/components/ToolLanding";
import { getToolBySlug } from "@/lib/site";

const tool = getToolBySlug("missing-values-checker")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription
};

export default function MissingValuesCheckerPage() {
  return <ToolLanding tool={tool} />;
}

