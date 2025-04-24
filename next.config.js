/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  },
};

module.exports = nextConfig; 