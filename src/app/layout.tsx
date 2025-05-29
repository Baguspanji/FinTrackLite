import type { Metadata } from 'next';
// Updated imports for Geist fonts
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FinTrack Lite',
  description: 'Simple financial tracking with AI insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        The GeistSans.variable and GeistMono.variable classes define CSS custom properties
        (--font-geist-sans and --font-geist-mono) which are then used in globals.css.
      */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
