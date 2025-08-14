const ENV =
  typeof window !== 'undefined' ? window.__NEXT_DATA__.env : process.env

export const locales = ['de', 'fr']
export const localeSegment = `:locale(${locales.join('|')})`
export const getSafeLocale = (locale) =>
  locales.includes(locale) ? locale : 'de'

export const DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
export const DRUPAL_DATA_BASE_URL = 'https://data.lobbywatch.ch'
export const DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

const SERVER_PORT = (typeof process !== 'undefined' && ENV.PORT) || 3000

const NEXT_PUBLIC_VERCEL_URL = ENV.NEXT_PUBLIC_VERCEL_URL
const PUBLIC_BASE_URL =
  ENV.PUBLIC_BASE_URL ||
  ENV.NEXT_PUBLIC_BASE_URL ||
  (NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : undefined)
export const CDN_FRONTEND_BASE_URL = PUBLIC_BASE_URL
export const ASSETS_SERVER_BASE_URL = ENV.ASSETS_SERVER_BASE_URL
export const STATEMENTS_FEATURED_IDS = ENV.STATEMENTS_FEATURED_IDS || ''
export const STATEMENTS_FEATURED_HERO_DE = ENV.STATEMENTS_FEATURED_HERO_DE || ''
export const STATEMENTS_FEATURED_HERO_FR = ENV.STATEMENTS_FEATURED_HERO_FR || ''

export const GRAPHQL_URL = ENV.GRAPHQL_URL
export const MATOMO_URL_BASE = ENV.MATOMO_URL_BASE
export const MATOMO_SITE_ID = ENV.MATOMO_SITE_ID

export const MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
export const MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
export const MAILCHIMP_ID = '82c011426c'
export const MAILCHIMPS_GROUP_FOR_LOCALE = {
  de: 'group[346712][4]',
  fr: 'group[346712][8]',
}

export const DEBUG_INFORMATION = !!ENV.DEBUG_INFORMATION

export const STATUS_POLL_INTERVAL_MS = +ENV.STATUS_POLL_INTERVAL_MS || 0

export const STRIPE_PUBLISHABLE_KEY = ENV.STRIPE_PUBLISHABLE_KEY
export const PAYPAL_BUSINESS = ENV.PAYPAL_BUSINESS
export const PAYPAL_FORM_ACTION = ENV.PAYPAL_FORM_ACTION
