import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "700"],
  variable: "--font-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CofFind — Yangon Cafe & Teahouse Guide",
  description: "A cozy, curated directory of Yangon specialty coffee roasters, quiet workspaces, and historic teahouses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoMyanmar.variable}`}>
      <body className="bg-cafe-cream text-cafe-espresso min-h-screen selection:bg-cafe-warm-bg selection:text-cafe-caramel">
        {children}
      </body>
    </html>
  );
}
