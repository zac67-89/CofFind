import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CofFind — Yangon Café Discovery",
  description: "A darkroom editorial index of Yangon specialty coffee roasters and heritage tea houses. Powered by OpenStreetMap & Google Maps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-walnut-shadow text-warm-cream min-h-screen selection:bg-bark-brown selection:text-warm-cream">
        {children}
      </body>
    </html>
  );
}
