const { PUBLIC_BASE_URL } = require('./constants')
const { ASSETS_SERVER_SOURCE_BASE_URL } = process.env

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cms.lobbywatch.ch'],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/api/language',
      },
      ASSETS_SERVER_SOURCE_BASE_URL && {
        source: '/assets/:path*',
        destination: `${ASSETS_SERVER_SOURCE_BASE_URL}/:path*`,
      },
    ].filter(Boolean)
  },
  async redirects() {
    return [
      PUBLIC_BASE_URL && {
        source: '/:path*',
        missing: [
          {
            type: 'host',
            value: new URL(PUBLIC_BASE_URL).hostname,
          },
          {
            type: 'header',
            key: 'X-Forwarded-Host',
            value: new URL(PUBLIC_BASE_URL).hostname,
          },
        ],
        permanent: true,
        destination: `${PUBLIC_BASE_URL}/:path*`,
      },
    ].filter(Boolean)
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: true,
  experimental: {
    largePageDataBytes: 512 * 1000, // 512KB
  },
}
