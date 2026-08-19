import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves only static files, so the app is exported as a SPA.
  output: "export",
  trailingSlash: true,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export default nextConfig;
