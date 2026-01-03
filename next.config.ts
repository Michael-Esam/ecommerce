import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.neon.tech', 
      },
      {
    unoptimized: true,
      },
    ],
  },
};

export default nextConfig;
