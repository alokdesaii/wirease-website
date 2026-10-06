import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: Unsplash placeholders until Wirease art-directed imagery is supplied.
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default nextConfig;
