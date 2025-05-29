
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Import ThemeProvider

export const metadata: Metadata = {
  title: 'FinTrack Lite',
  description: 'Pelacakan keuangan sederhana dengan wawasan AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning> {/* suppressHydrationWarning for theme class changes */}
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
