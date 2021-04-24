const {
  NEXT_PUBLIC_PUBLIC_BASE_URL,
  NEXT_PUBLIC_VERCEL_URL,
  NEXT_PUBLIC_GA_TRACKING_ID,
  NEXT_PUBLIC_DEBUG_INFORMATION
} = process.env

exports.locales = ['de', 'fr']
exports.localeSegment = `:locale(${exports.locales.join('|')})`

exports.DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

exports.PUBLIC_BASE_URL = NEXT_PUBLIC_PUBLIC_BASE_URL || NEXT_PUBLIC_VERCEL_URL

const serverPort = (typeof process !== 'undefined' && process.env.PORT) || 3000

const location = typeof window !== 'undefined' && window.location
const hostname = location ? location.hostname : '127.0.0.1'
const port = location ? location.port : serverPort
const protocol = location ? location.protocol : 'http:'
exports.GRAPHQL_URI = NEXT_PUBLIC_VERCEL_URL
  ? `https://${NEXT_PUBLIC_VERCEL_URL}/graphql`
  : `${protocol}//${hostname}${port ? `:${port}` : ''}/graphql`

exports.GA_TRACKING_ID = NEXT_PUBLIC_GA_TRACKING_ID

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333'
}

exports.DEBUG_INFORMATION = !!NEXT_PUBLIC_DEBUG_INFORMATION
