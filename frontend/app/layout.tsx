import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AnimationProvider } from "@/components/AnimationProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import ChatWidget from "@/components/ChatWidget";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export const metadata: Metadata = {
  title: "Telueve | Event Campus",
  description: "University event management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen pt-16">
        <Providers>
          <AnimationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <AnnouncementBanner />
              <main className="flex-grow">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
              <ChatWidget />
              <Cursor />
            </div>
          </AnimationProvider>
        </Providers>
      </body>
    </html>
  );
}
