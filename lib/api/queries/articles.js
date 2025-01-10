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

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: {
      articles: {
        pages: +data?.pages,
        list: data?.list.map((article) => mapPage(locale, article)),
      },
    },
    error,
    isLoading,
  }
}

export const getAllArticles = async ({ page, locale, limit }) => {
  const query = {
    'load-entity-refs': 'taxonomy_term,file',
    limit: limit ?? 10,
    page: page ?? 0,
  }

  const url = api.drupal(locale, 'daten/articles', query)

  const data = await fetcher(url)

  return {
    data: {
      articles: {
        pages: +data?.pages,
        list: data?.list.map((article) => mapPage(locale, article)),
      },
    },
  }
}

export const getArticle = async ({ locale, path }) => {
  const query = {
    'load-entity-refs': 'taxonomy_term,file',
    url: path.join('/'),
  }
  const url = api.drupal(locale, 'daten/page', query)

  const response = await fetch(url)

  if (response.ok) {
    const data = await response.json()
    return {
      data: { page: response.ok && mapPage(locale, data) },
    }
  }

  return { error: response }
}
