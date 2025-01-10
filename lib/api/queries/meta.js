import { fetcher } from '../fetch'
import useSWR from 'swr'
import * as api from 'lib/api/api'

export const useMeta = ({ locale }) => {
  const url = api.drupal(locale, 'daten/meta')
  const meta = useSWR(url, fetcher, { revalidateOnFocus: false }, {
    revalidateOnFocus: false,
  })

  return {
    data: { meta: { links: meta.data?.links } },
    error: meta.error,
    isLoading: meta.isLoading,
  }
}
