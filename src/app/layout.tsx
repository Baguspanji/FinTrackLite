
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const APP_NAME = "FinTrack Lite";
const APP_DESCRIPTION = "Pelacakan keuangan sederhana dengan wawasan AI.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
    // startupImage: [], // You can add startup images for different devices here
  },
  formatDetection: {
    telephone: false,
  },
  // openGraph: { // Optional: For better social sharing
  //   type: "website",
  //   siteName: APP_NAME,
  //   title: {
  //     default: APP_NAME,
  //     template: `%s - ${APP_NAME}`,
  //   },
  //   description: APP_DESCRIPTION,
  // },
  // twitter: { // Optional: For Twitter card previews
  //   card: "summary",
  //   title: {
  //     default: APP_NAME,
  //     template: `%s - ${APP_NAME}`,
  //   },
  //   description: APP_DESCRIPTION,
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2A9DF4" }, // Primary color light
    { media: "(prefers-color-scheme: dark)", color: "#4DAEFF" },  // Primary color dark
  ],
  // width: 'device-width', // Default
  // initialScale: 1, // Default
  // maximumScale: 1, // Can be useful for PWAs to prevent zooming
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning> {/* suppressHydrationWarning for theme class changes */}
      <head>
        {/* Preconnect to Google Fonts if you were using them directly, not needed for Geist */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="FinTrack" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Add other icon sizes for apple-touch-icon if needed */}
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
