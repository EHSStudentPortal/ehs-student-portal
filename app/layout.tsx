import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, DM_Mono, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400","500","600","700","800"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["300","400","500","600","700"], display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", weight: ["300","400","500"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300","400","500","600","700","800","900"], display: "swap" });

const BASE_URL = "https://avinashamanchi.github.io/ehs-student-portal";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "EHS Student Portal — Emerald High School", template: "%s | EHS Portal" },
  description: "Your all-in-one student companion for Emerald High School, Dublin CA. Live bell schedule, interactive campus map, staff directory, complete course catalog, lunch menu, school calendar, and anonymous student voice.",
  keywords: ["Emerald High School","EHS","Dublin CA","DUSD","Dublin Unified School District","student portal","bell schedule","campus map","staff directory","course catalog","lunch menu","school calendar","2025-2026"],
  authors: [{ name: "EHS Student Portal" }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website", locale: "en_US", url: BASE_URL, siteName: "EHS Student Portal",
    title: "EHS Student Portal — Emerald High School, Dublin CA",
    description: "Live bell schedule, campus map, staff directory, courses, lunch menu & community voice for Emerald High School.",
  },
  twitter: { card: "summary_large_image", title: "EHS Student Portal — Emerald High School", description: "Your all-in-one student companion for EHS, Dublin CA." },
  alternates: { canonical: BASE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#064e3b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="application-name" content="EHS Portal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EHS Portal" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "EducationalOrganization",
          name: "Emerald High School", alternateName: "EHS", url: "https://ehs.dublinusd.org",
          address: { "@type": "PostalAddress", addressLocality: "Dublin", addressRegion: "CA", postalCode: "94568", addressCountry: "US" },
          parentOrganization: { "@type": "Organization", name: "Dublin Unified School District", url: "https://www.dublinusd.org" },
        })}} />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} ${inter.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
