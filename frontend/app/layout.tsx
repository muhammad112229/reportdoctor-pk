import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { absoluteUrl, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Excel/CSV Reports for Pakistani Businesses`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: absoluteUrl(),
    title: `${site.name} | Excel/CSV Reports for Pakistani Businesses`,
    description: site.description,
    siteName: site.name,
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "ReportDoctor.pk Excel and CSV report generator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Excel/CSV Reports for Pakistani Businesses`,
    description: site.description,
    images: ["/og-placeholder.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
