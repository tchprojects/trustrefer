import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustRefer — Referral Link Directory",
  description:
    "A curated, community-driven hub where you discover, share, and validate referral links across Energy, Broadband, EV, Investing, Cashback, and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://trustrefer.co.uk"),
  openGraph: {
    title: "TrustRefer — Referral Link Directory",
    description: "Discover and share trusted referral links across UK categories.",
    siteName: "TrustRefer",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="antialiased">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
