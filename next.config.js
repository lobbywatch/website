module.exports = {
  future: {
    webpack5: true,
  },
  images: {
    domains: ['cms.lobbywatch.ch'],
  },
  webpack: (config, { dev }) => {
    const alias = { ...config.resolve.alias }
    delete alias.url // alias to native-url
    config.resolve = {
      ...config.resolve,
      alias
    }

    return config
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: true
}
