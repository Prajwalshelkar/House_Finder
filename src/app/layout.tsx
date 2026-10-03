import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShortlistDrawer from "@/components/properties/ShortlistDrawer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NagpurHomes - Nagpur Real Estate Discovery & RERA Verified Dealer Portal",
  description:
    "Discover verified flats, villas, plots, and commercial properties in Nagpur across Dharampeth, Wardha Road, Besa, Manish Nagar, Sitabuldi, and MIHAN. Connect directly with MahaRERA-verified dealers and explore AI-powered valuation.",
  keywords: [
    "Nagpur Real Estate",
    "Flats in Nagpur",
    "Properties in Dharampeth",
    "Flats on Wardha Road",
    "Flats in Besa Manish Nagar",
    "MIHAN Nagpur apartments",
    "Nagpur property dealers",
    "MahaRERA verified Nagpur",
  ],
  authors: [{ name: "NagpurHomes Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <ShortlistDrawer />
      </body>
    </html>
  );
}
