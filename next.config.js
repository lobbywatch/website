const { localeSegment } = require('./constants')

module.exports = {
  future: {
    webpack5: true,
  },
  images: {
    domains: ['cms.lobbywatch.ch'],
  },
  webpack: (config) => {
    const alias = { ...config.resolve.alias }
    delete alias.url // alias to native-url
    config.resolve = {
      ...config.resolve,
      alias,
    }

    return config
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/api/language',
      },
      {
        source: '/graphql',
        destination: '/api/graphql',
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
        destination: '/graphql',
        permanent: false,
      },
    ]
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: true,
}
