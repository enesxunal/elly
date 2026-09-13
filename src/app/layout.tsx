import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fahrschule Elly | Fahrschule in Duisburg-Meiderich",
  description:
    "Fahrschule Elly in Duisburg-Meiderich: Führerschein Klasse B, B197, BF17, BE, B96 sowie A, A2, A1 und AM. Theorie dienstags und donnerstags, Erste-Hilfe-Kurs jeden Samstag.",
  icons: {
    icon: "/assets/elly-logo.png",
    shortcut: "/assets/elly-logo.png",
    apple: "/assets/elly-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
