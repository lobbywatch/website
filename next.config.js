module.exports = {
  webpack: (config, { dev }) => {
    const entryFactory = config.entry
    const polyfillPath = './lib/polyfill.js'

    const alias = { ...config.resolve.alias }
    delete alias.url // alias to native-url
    config.resolve = {
      ...config.resolve,
      alias
    }

    config.entry = async () => {
      const entries = await entryFactory()

      if (
        entries['main.js'] &&
        !entries['main.js'].includes(polyfillPath)
      ) {
        entries['main.js'].unshift(polyfillPath)
      }

      return entries
    }
    return config
  },
  poweredByHeader: false,
  useFileSystemPublicRoutes: false
}
