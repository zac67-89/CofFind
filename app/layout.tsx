import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-cafe-cream text-cafe-espresso min-h-screen selection:bg-cafe-warm-bg selection:text-cafe-caramel">
        {children}
      </body>
    </html>
  );
}
