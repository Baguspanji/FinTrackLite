
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Required for static export to GitHub Pages
  // IMPORTANT: Replace '<repository-name>' with your actual GitHub repository name.
  // For example, if your repo URL is https://github.com/your-username/my-fintrack-app,
  // then basePath should be '/my-fintrack-app'
  basePath: '/FinTrackLite', // Make sure this matches your repository name for GitHub Pages
  images: {
    // Image optimization via Next.js's default loader doesn't work well with static exports.
    // Setting unoptimized to true will serve images as-is.
    // Ensure your images are reasonably optimized beforehand.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Recommended for GitHub Pages to ensure routing works correctly,
  // as GitHub Pages might enforce trailing slashes.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false, // Set to false to see actual build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // You might want to set this to false in the future too
  },
};

export default nextConfig;
