import type { Metadata } from "next";
import { Sora, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const roboto = Roboto_Mono({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diff / Desk — forensic text comparison",
  description: "Compare two texts line-by-line and highlight additions and removals.",
  keywords: ["diff","compare","text","line diff"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  publisher: "Bookchaowalit",
  metadataBase: new URL("https://diffchecker.bookchaowalit.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Diff / Desk — forensic text comparison",
    description: "Compare two texts line-by-line and highlight additions and removals.",
    siteName: "Bookchaowalit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diff / Desk — forensic text comparison",
    description: "Compare two texts line-by-line and highlight additions and removals.",
    creator: "@bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${roboto.variable}`}>
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
