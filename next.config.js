module.exports = {
  webpack: (config, { dev }) => {
    const entryFactory = config.entry
    const polyfillPath = './lib/polyfill.js'

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
}
