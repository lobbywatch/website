const ENV = typeof window !== 'undefined' ? window.__NEXT_DATA__.env : process.env

exports.locales = ['de', 'fr']
exports.EXPRESS_PORT = (typeof process !== 'undefined' && process.env.PORT) || 3000
exports.DRUPAL_BASE_URL = 'https://lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://lobbywatch.ch'

const location = typeof window !== 'undefined' && window.location
const hostname = location ? location.hostname : '127.0.0.1'
const port = location ? location.port : exports.EXPRESS_PORT
const protocol = location ? location.protocol : 'http:'
exports.GRAPHQL_URI = `${protocol}//${hostname}${port ? `:${port}` : ''}/graphql`

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333'
}

exports.PUBLIC_BASE_URL = ENV.PUBLIC_BASE_URL

exports.DEBUG_INFORMATION = !!ENV.DEBUG_INFORMATION

exports.COUNTDOWN_UTC = ENV.COUNTDOWN_UTC
exports.COUNTDOWN_DATE = ENV.COUNTDOWN_UTC ? new Date(ENV.COUNTDOWN_UTC) : null
