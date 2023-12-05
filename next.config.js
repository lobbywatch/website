const { GRAPHQL_URL, localeSegment } = require('./constants')
const {
  ASSETS_SERVER_SOURCE_BASE_URL
} = process.env

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
      {
        source: '/graphql',
        destination: GRAPHQL_URL,
      },
      ASSETS_SERVER_SOURCE_BASE_URL && {
        source: '/assets/:path*',
        destination: `${ASSETS_SERVER_SOURCE_BASE_URL}/:path*`,
      },
    ].filter(Boolean)
  },
  async redirects() {
    return [
      {
        source: `/${localeSegment}/search/daten`,
        destination: '/:locale/search',
        permanent: true,
      },
      {
        source: `/${localeSegment}/search/daten/:term`,
        destination: '/:locale/search?term=:term',
        permanent: true,
      },
      {
        source: '/graphiql',
        destination: GRAPHQL_URL.replace('/graphql', '/graphiql'),
        permanent: false,
      },
      {
        source: '/angebote',
        destination: '/de/patronage',
        permanent: false,
      },
    ]
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: true,
  experimental: {
    largePageDataBytes: 512 * 1000, // 512KB
  },
}
