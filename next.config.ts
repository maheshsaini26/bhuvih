import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qzkq4itdag5y9qpy.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;