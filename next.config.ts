import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/workshop',
        permanent: true,
      },
      {
        source: '/admin/gallery',
        destination: '/admin/workshop',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
