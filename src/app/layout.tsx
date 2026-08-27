import type { Metadata } from "next";
import { Allura, Barriecito, DM_Sans, Libre_Baskerville, Rubik } from "next/font/google";
import { venue } from "@/lib/venue";
import "./globals.css";

const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
});

const barriecito = Barriecito({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-barriecito",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Calmo — ${venue.tagline}`,
  description: venue.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${allura.variable} ${barriecito.variable} ${rubik.variable} ${dmSans.variable} ${libreBaskerville.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
