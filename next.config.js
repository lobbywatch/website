module.exports = {
  webpack: (config) => {
    const entryFactory = config.entry
    config.entry = () => (
      entryFactory()
        .then((entry) => {
          entry['main.js'] = [
            'babel-polyfill',
            entry['main.js']
          ]
          return entry
        })
    )
    return config
  }
}
