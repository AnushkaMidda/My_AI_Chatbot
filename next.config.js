/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
