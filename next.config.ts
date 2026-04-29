import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/wilayah/:path*',
        destination: 'https://www.emsifa.com/api-wilayah-indonesia/api/:path*',
      },
    ];
  },
  // Allow localtunnel host for dev Server
  allowedDevOrigins: ['nisma-test-app.loca.lt', 'localhost:3000'],
};

export default nextConfig;
