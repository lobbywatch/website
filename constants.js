const ENV =
  typeof window !== 'undefined' ? window.__NEXT_DATA__.env : process.env

export const DRUPAL_BASE_URL = 'https://cms.lobbywatch.ch'
export const DRUPAL_DATA_BASE_URL = 'https://data.lobbywatch.ch'
export const IMAGE_BASE_URL =
  'https://www.parlament.ch/sitecollectionimages/profil/portrait-260/'

export const SERVER_PORT = (typeof process !== 'undefined' && ENV.PORT) || 3000

export const NEXT_PUBLIC_VERCEL_URL = ENV.NEXT_PUBLIC_VERCEL_URL
export const PUBLIC_BASE_URL =
  ENV.PUBLIC_BASE_URL ||
  ENV.NEXT_PUBLIC_BASE_URL ||
  (NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : undefined)

export const MATOMO_URL_BASE = ENV.MATOMO_URL_BASE
export const MATOMO_SITE_ID = ENV.MATOMO_SITE_ID
