const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const NEXT_PUBLIC_DEBUG_INFORMATION = process.env.NEXT_PUBLIC_DEBUG_INFORMATION

const locales = ['de', 'fr']
exports.locales = locales
exports.localeSegment = `:locale(${locales.join('|')})`
exports.getSafeLocale = (locale) => (locales.includes(locale) ? locale : 'de')

exports.NEXT_PUBLIC_BASE_URL = NEXT_PUBLIC_BASE_URL
exports.DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

const SERVER_PORT = (typeof process !== 'undefined' && process.env.PORT) || 3000
exports.SERVER_PORT = SERVER_PORT

const PUBLIC_BASE_URL =
  NEXT_PUBLIC_BASE_URL ||
  (NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : undefined)
exports.PUBLIC_BASE_URL = PUBLIC_BASE_URL
exports.CDN_FRONTEND_BASE_URL = PUBLIC_BASE_URL

const location = typeof window !== 'undefined' && window.location
exports.GRAPHQL_URI = location
  ? `${location.protocol}//${location.hostname}${
      location.port ? `:${location.port}` : ''
    }/graphql`
  : NEXT_PUBLIC_VERCEL_URL
  ? `${PUBLIC_BASE_URL}/graphql` // on vercel there is no local http server, we need to go via public url
  : `http://127.0.0.1:${SERVER_PORT}/graphql` // for fast access on heroku and for localhost

exports.GA_TRACKING_ID = NEXT_PUBLIC_GA_TRACKING_ID

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333',
}

exports.DEBUG_INFORMATION = !!NEXT_PUBLIC_DEBUG_INFORMATION

exports.STATUS_POLL_INTERVAL_MS = +process.env.NEXT_PUBLIC_STATUS_POLL_INTERVAL_MS || 0
