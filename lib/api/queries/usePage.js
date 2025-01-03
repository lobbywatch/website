import useSWR from 'swr'
import { fetcher } from '../fetch'
import * as api from '../api'
import { mapPage } from '../mappers'

export const usePage = ({ locale, path }) => {
  const query = {
    'load-entity-refs': 'taxonomy_term,file',
    url: path.join('/'),
  }
  const url = api.drupal(locale, 'daten/page', query)

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: { page: data && mapPage(locale, data) },
    error,
    isLoading,
  }
}
