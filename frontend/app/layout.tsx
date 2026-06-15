import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { absoluteUrl, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  manifest: "/site.webmanifest",
  title: {
    default: `${site.name} | Excel/CSV Reports for Pakistani Businesses`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    type: "website",
    url: absoluteUrl(),
    title: `${site.name} | Excel/CSV Reports for Pakistani Businesses`,
    description: site.description,
    siteName: site.name,
    images: [
      {
        url: "/og-image.svg",
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
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
