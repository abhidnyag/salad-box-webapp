/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // On Windows, antivirus/file locks intermittently break the rename of
      // .next/cache/webpack/*.pack.gz, which corrupts the dev build and makes
      // routes (e.g. /api/graphql) fall through to a 404. Using an in-memory
      // cache in dev avoids those filesystem renames entirely.
      config.cache = { type: 'memory' };
    }
    return config;
  },
};

module.exports = nextConfig;
