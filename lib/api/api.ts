import qs from 'querystring'
import { DRUPAL_DATA_BASE_URL } from '../../constants'
import { Locale } from '../types'

export const data = (
  locale: Locale,
  path: string,
  query?: Record<string, string>,
) => {
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
