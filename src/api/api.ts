import { DRUPAL_DATA_BASE_URL } from '../../constants'
import type { Locale } from '../domain'
import type { Query } from './fetch'

export const data = <A>(locale: Locale, path: string, query?: Query<A>) => {
  const defaultQuery = {
    q: [encodeURIComponent(locale), path].join('/'),
    includeMetaData: '1',
    limit: 'none',
    lang: locale,
  }

  const finalQuery = query
    ? Object.assign(defaultQuery, {
        select_fields: query.select_fields.join(','),
      })
    : defaultQuery

  return `${DRUPAL_DATA_BASE_URL}/data.php?${new URLSearchParams(finalQuery).toString()}`
}
