/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/node_modules/**", "**/.agents/**", "**/.claude/**", "**/.idea/**"],
    };
    return config;
  },
};

module.exports = nextConfig;
