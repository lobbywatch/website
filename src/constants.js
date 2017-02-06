// common js for server

exports.locales = ['de', 'fr']
exports.EXPRESS_PORT = typeof process !== 'undefined' && process.env.PORT || 3000
exports.DRUPAL_BASE_URL = 'https://lobbywatch-cms.interactivethings.io'
exports.DRUPAL_IMAGE_BASE_URL = 'https://lobbywatch.ch'

const location = typeof window !== 'undefined' && window.location
const hostname = location ? location.hostname : '127.0.0.1'
const port = location ? location.port : exports.EXPRESS_PORT
const protocol = location ? location.protocol : 'http:'
exports.GRAPHQL_URI = `${protocol}//${hostname}${port ? `:${port}` : ''}/graphql`
