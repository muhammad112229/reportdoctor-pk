import type { Metadata } from "next";
import { ToolLanding } from "@/components/ToolLanding";
import { getToolBySlug } from "@/lib/site";

const tool = getToolBySlug("duplicate-rows-finder")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription
};

export default function DuplicateRowsFinderPage() {
  return <ToolLanding tool={tool} />;
}

