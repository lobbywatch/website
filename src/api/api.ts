import qs from 'querystring'
import { DRUPAL_DATA_BASE_URL } from '../../constants'
import { Locale } from '../domain'
import { Query } from './fetch'

export const data = <A>(locale: Locale, path: string, query?: Query<A>) => {
  const fullQuery = Object.assign(
    {
      q: [encodeURIComponent(locale), path].join('/'),
      includeMetaData: 1,
      limit: 'none',
      lang: locale,
    },
    query ? { select_fields: query.select_fields.join(',') } : {},
  )
  return `${DRUPAL_DATA_BASE_URL}/data.php?${qs.encode(fullQuery)}`
}
