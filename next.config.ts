import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://images.pexels.com https://res.cloudinary.com https://*.basemaps.cartocdn.com https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'self' https://maps.google.com https://www.google.com; frame-ancestors 'none'; block-all-mixed-content; ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}`,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/premium_photo-**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
      {
        pathname: '/hero/**',
      },
      {
        pathname: '/portfolio/**',
      },
      {
        pathname: '/certificate/**',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
