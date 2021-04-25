const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const NEXT_PUBLIC_DEBUG_INFORMATION = process.env.NEXT_PUBLIC_DEBUG_INFORMATION

const locales = ['de', 'fr']
exports.locales = locales
exports.localeSegment = `:locale(${locales.join('|')})`
exports.getSafeLocale = locale => locales.includes(locale)
  ? locale
  : 'de'

exports.DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_DATA_BASE_URL = 'https://cms.lobbywatch.ch'
exports.DRUPAL_IMAGE_BASE_URL = 'https://cms.lobbywatch.ch'

const PUBLIC_BASE_URL = NEXT_PUBLIC_BASE_URL || (
  NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : undefined
)
exports.PUBLIC_BASE_URL = PUBLIC_BASE_URL

const location = typeof window !== 'undefined' && window.location
exports.GRAPHQL_URI = location
  ? `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/graphql`
  : PUBLIC_BASE_URL
    ? `${PUBLIC_BASE_URL}/graphql`
    : `http://127.0.0.1:${process.env.PORT || 3000}/graphql`

exports.GA_TRACKING_ID = NEXT_PUBLIC_GA_TRACKING_ID

exports.MAILCHIMP_BASE_URL = 'https://lobbywatch.us8.list-manage.com'
exports.MAILCHIMP_U = 'd27da194665399ad4c9acc6fd'
exports.MAILCHIMP_ID_FOR_LOCALE = {
  de: '82c011426c',
  fr: 'b5a3964333'
}

exports.DEBUG_INFORMATION = !!NEXT_PUBLIC_DEBUG_INFORMATION
