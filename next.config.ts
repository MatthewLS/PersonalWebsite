import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-vercel-blob-domain.com', // Replace with your blob domain
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
