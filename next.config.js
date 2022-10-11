const { GRAPHQL_URL, localeSegment } = require('./constants')

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
    ]
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
    ]
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: true,
}
