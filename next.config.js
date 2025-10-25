/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for better-sqlite3 on server side
      config.externals.push('better-sqlite3');
    }
    return config;
  },
  serverExternalPackages: ['better-sqlite3'],
}

module.exports = nextConfig
