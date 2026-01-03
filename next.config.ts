import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.neon.tech', 
      },
      {
        protocol: 'https',
        hostname: '**.aws.neon.tech', 
      },
    ],
  },
};

export default nextConfig;
