
import type {NextConfig} from 'next';

// @ts-ignore next-pwa is not typed, or has conflicting types with newer Next.js/TypeScript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // fallbacks: { // Optional: for custom offline pages
  //   document: '/offline.html', // You would need to create this page
  // },
});

const nextConfig: NextConfig = {
  // output: 'export', // Commented out: Server Actions and PWA dynamic registration work best with a Node.js server.
  // IMPORTANT: basePath was for GitHub Pages. Remove or adjust if deploying elsewhere.
  // basePath: '/FinTrackLite', 
  images: {
    // unoptimized: true, // Commented out: No longer needed if not doing static export.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // trailingSlash: true, // Commented out: Recommended for GitHub Pages, may not be needed otherwise.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default withPWA(nextConfig);
