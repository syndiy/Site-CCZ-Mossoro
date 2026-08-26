import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/img/:path*", destination: "/api/images/:path*" }];
  },
};

export default nextConfig;
