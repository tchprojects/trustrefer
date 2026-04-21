import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/Providers";
import { auth } from "@/lib/auth";

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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
        url: "/images/link_icons/trust_refer.png",
        width: 512,
        height: 512,
        alt: "TrustRefer",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TrustRefer — Trusted Referral Links",
    description:
      "We're all about trusted referral links. Find, share and use referral offers from real people for popular products and services.",
    images: ["/images/link_icons/trust_refer.png"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="antialiased">
        <Providers session={session}>
          <Toaster>{children}</Toaster>
        </Providers>
      </body>
    </html>
  );
}
