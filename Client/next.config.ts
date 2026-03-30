import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

export default nextConfig;
