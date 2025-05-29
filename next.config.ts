
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Commented out: Server Actions require a Node.js server environment.
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

export default nextConfig;
