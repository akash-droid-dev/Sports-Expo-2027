import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The design logic runs effects once per mount (maps, scroll listeners), as in the prototype.
  reactStrictMode: false,
};

export default nextConfig;
