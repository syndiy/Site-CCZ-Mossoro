import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: { root: path.resolve(__dirname) },
  async rewrites() {
    return [{ source: "/img/:path*", destination: "/api/images/:path*" }];
  },
};

export default nextConfig;
