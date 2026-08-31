import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // Turbopack's persistent dev cache (on by default since 16.1) kept
    // serving stale CSS/images after edits; in-memory HMR is plenty here.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
