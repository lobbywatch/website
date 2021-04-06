const ENV = typeof window !== 'undefined' ? window.__NEXT_DATA__.env : process.env

exports.locales = ['de', 'fr']
exports.localeSegment = `:locale(${exports.locales.join('|')})`
exports.EXPRESS_PORT = (typeof process !== 'undefined' && process.env.PORT) || 3000
exports.DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

exports.PUBLIC_BASE_URL = ENV.PUBLIC_BASE_URL

const location = typeof window !== 'undefined' && window.location
const hostname = location ? location.hostname : '127.0.0.1'
const port = location ? location.port : exports.EXPRESS_PORT
const protocol = location ? location.protocol : 'http:'
exports.GRAPHQL_URI = `${protocol}//${hostname}${port ? `:${port}` : ''}/graphql`

exports.GOOGLE_SITE_VERIFICATION = 'google8a64872b44ccae7c.html'
exports.GA_TRACKING_ID = ENV.GA_TRACKING_ID

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333'
}

exports.DEBUG_INFORMATION = !!ENV.DEBUG_INFORMATION
