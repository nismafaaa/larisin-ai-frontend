import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/wilayah/:path*',
        destination: 'https://emsifa.github.io/api-wilayah-indonesia/api/:path*',
      },
    ];
  },
};

export default nextConfig;
