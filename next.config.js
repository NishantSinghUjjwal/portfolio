/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  },
  // Disable ESLint during build
  eslint: {
    // Warning instead of error during build
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    // Warning instead of error during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 