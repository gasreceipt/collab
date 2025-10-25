import type { Metadata } from "next";
import "./globals.css";
import EventTracker from "@/components/tracking/EventTracker";

export const metadata: Metadata = {
  title: "vSMPL Ecosystem - Three Brands, One Philosophy",
  description: "Discover Uniformish apparel, Catnip Board Co. skateboards, and Bad Arctic jewelry - a curated ecosystem of craft, scarcity, and authenticity.",
  keywords: "vSMPL, Uniformish, Catnip Board Co, Bad Arctic, sustainable apparel, skateboard decks, sterling silver jewelry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <EventTracker />
        {children}
      </body>
    </html>
  );
}
