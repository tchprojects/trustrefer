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
  title: "TrustRefer — Trusted Referral Links",
  description:
    "We're all about trusted referral links. Find, share and use referral offers from real people for popular products and services.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://trustrefer.co.uk"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Trust_Refer_Brand_Icon.jpg", type: "image/jpeg" },
    ],
    apple: "/Trust_Refer_Brand_Icon.jpg",
  },
  openGraph: {
    title: "TrustRefer — Trusted Referral Links",
    description:
      "We're all about trusted referral links. Find, share and use referral offers from real people for popular products and services.",
    siteName: "TrustRefer",
    url: "https://trustrefer.co.uk",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/Trust_Refer_Brand_Icon.jpg",
        width: 500,
        height: 500,
        alt: "TrustRefer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TrustRefer — Trusted Referral Links",
    description:
      "We're all about trusted referral links. Find, share and use referral offers from real people for popular products and services.",
    images: ["/Trust_Refer_Brand_Icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
