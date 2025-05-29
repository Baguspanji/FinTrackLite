
import type {NextConfig} from 'next';

// Check if we're in production/deployment mode
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // Only use export output for GitHub Pages deployment
  ...(isGitHubPages && { output: 'export' }),
  // Only use basePath for GitHub Pages deployment
  ...(isGitHubPages && { basePath: '/FinTrackLite' }), 
  images: {
    // Enable unoptimized images for static export (GitHub Pages)
    ...(isGitHubPages && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable trailing slash for GitHub Pages
  ...(isGitHubPages && { trailingSlash: true }),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
