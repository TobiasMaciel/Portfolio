import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? "/Portfolio" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/Portfolio/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_ACTIONS ? "/Portfolio" : "",
  },
  allowedDevOrigins: ['192.168.1.5', 'localhost']
};

export default nextConfig;
