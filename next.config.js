module.exports = {
  future: {
    webpack5: true,
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
  useFileSystemPublicRoutes: false
}
