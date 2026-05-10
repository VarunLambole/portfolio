import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Disable source maps in production to hide code structure
  productionBrowserSourceMaps: false,

  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Image optimization - allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features we don't need
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // XSS Protection (legacy but still useful)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },

  // Rewrites to proxy API requests (hide backend URL from browser)
  async rewrites() {
    // On Netlify, process.env.URL is the deployed site URL; the CDN redirect
    // rule handles /api/* -> serverless function before Next.js rewrites apply.
    const apiUrl = process.env.API_URL || process.env.URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
