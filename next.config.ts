import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Si tu repositorio se llama "Portfolio" y tu URL será "usuario.github.io/Portfolio", descomentá esta línea y la de abacjo:
  // basePath: "/Portfolio",
  // assetPrefix: "/Portfolio/",
  allowedDevOrigins: ['192.168.1.5', 'localhost']
};

export default nextConfig;
