const ENV =
  typeof window !== 'undefined' ? window.__NEXT_DATA__.env : process.env

const locales = ['de', 'fr']
exports.locales = locales
exports.localeSegment = `:locale(${locales.join('|')})`
exports.getSafeLocale = (locale) => (locales.includes(locale) ? locale : 'de')

exports.DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

const SERVER_PORT = (typeof process !== 'undefined' && ENV.PORT) || 3000
exports.SERVER_PORT = SERVER_PORT

const NEXT_PUBLIC_VERCEL_URL = ENV.NEXT_PUBLIC_VERCEL_URL
const PUBLIC_BASE_URL =
  ENV.PUBLIC_BASE_URL ||
  ENV.NEXT_PUBLIC_BASE_URL ||
  (NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : undefined)
exports.PUBLIC_BASE_URL = PUBLIC_BASE_URL
exports.CDN_FRONTEND_BASE_URL = PUBLIC_BASE_URL
exports.ASSETS_SERVER_BASE_URL = ENV.ASSETS_SERVER_BASE_URL
exports.STATEMENTS_FEATURED_IDS = ENV.STATEMENTS_FEATURED_IDS || ''
exports.STATEMENTS_FEATURED_HERO_DE = ENV.STATEMENTS_FEATURED_HERO_DE || ''
exports.STATEMENTS_FEATURED_HERO_FR = ENV.STATEMENTS_FEATURED_HERO_FR || ''

exports.GRAPHQL_URL = ENV.GRAPHQL_URL
exports.MATOMO_URL_BASE = ENV.MATOMO_URL_BASE
exports.MATOMO_SITE_ID = ENV.MATOMO_SITE_ID

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333',
}

exports.DEBUG_INFORMATION = !!ENV.DEBUG_INFORMATION

exports.STATUS_POLL_INTERVAL_MS = +ENV.STATUS_POLL_INTERVAL_MS || 0

exports.STRIPE_PUBLISHABLE_KEY = ENV.STRIPE_PUBLISHABLE_KEY
exports.PAYPAL_BUSINESS = ENV.PAYPAL_BUSINESS
exports.PAYPAL_FORM_ACTION = ENV.PAYPAL_FORM_ACTION
