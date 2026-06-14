import type { MetadataRoute } from "next";
import { absoluteUrl, blogPosts, sampleReports, toolPages } from "@/lib/site";
import { seoLandingPages } from "@/lib/seoLanding";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/tools",
    "/sample-reports",
    "/templates",
    "/pricing",
    "/learn",
    "/free-scan",
    "/about",
    "/contact",
    "/privacy",
    "/terms"
  ];
  const toolPaths = toolPages.map((tool) => `/tools/${tool.slug}`);
  const seoPaths = seoLandingPages.map((page) => `/${page.slug}`);
  const blogPaths = blogPosts.map((post) => `/learn/${post.slug}`);
  const reportPaths = sampleReports.map((report) => `/sample-reports/${report.slug}`);

  return [...staticPaths, ...seoPaths, ...toolPaths, ...blogPaths, ...reportPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date("2026-06-14"),
    changeFrequency: path.includes("/blog/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : 0.7
  }));
}
