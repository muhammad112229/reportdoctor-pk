import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/dashboard", "/dashboard/", "/account", "/account/", "/signin", "/signup", "/auth-debug"]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
