/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
