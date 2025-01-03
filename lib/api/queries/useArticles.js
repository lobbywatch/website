import * as api from '../api'
import { mapPage } from '../mappers'
import { fetcher } from '../fetch'
import useSWR from 'swr'

export const useArticles = ({ locale, limit, page }) => {
  const query = {
    'load-entity-refs': 'taxonomy_term,file',
    limit,
    page,
  }

  const url = api.drupal(locale, 'daten/articles', query)

  const { data, error, isLoading } = useSWR(url, fetcher, {revalidateOnFocus: false})

  return {
    data: {
      articles: {
        pages: +data?.pages,
        list: data?.list.map((article) => mapPage(locale, article)),
      }
    },
    error,
    isLoading,
  }
}
