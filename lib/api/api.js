import qs from 'querystring'
import { DRUPAL_BASE_URL, DRUPAL_DATA_BASE_URL } from '../../constants'

export const drupal = (locale, path, query) => {
  const queryString = query ? '?' + qs.encode(query) : ''
  return [
    DRUPAL_BASE_URL,
    '/',
    encodeURIComponent(locale),
    path ? `/${path}` : '',
    queryString,
  ].join('')
}

export const data = (locale, path, query) => {
  const fullQuery = Object.assign(
    {
      q: [encodeURIComponent(locale), path].join('/'),
      includeMetaData: 1,
      limit: 'none',
      lang: locale,
    },
    query,
  )
  return `${DRUPAL_DATA_BASE_URL}/data.php?${qs.encode(fullQuery)}`
}
