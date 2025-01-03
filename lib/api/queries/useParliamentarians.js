import { useT } from '../../../src/components/Message'
import useSWR from 'swr'
import * as api from '../api'
import { mapParliamentarian } from '../mappers'
import { fetcher } from '../fetch'
import { ascending } from 'd3-array'

export const useParliamentarians = ({ locale, query }) => {
  const t = useT(locale)

  const url = api.data(
    locale,
    'data/interface/v1/json/table/parlamentarier/flat/list',
    query,
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  const parliamentarians = data?.data.map((p) => mapParliamentarian(p, t)) ?? []

  // default: sort by lastname
  parliamentarians.sort((a, b) =>
    ascending(a.lastName.toLowerCase(), b.lastName.toLowerCase()),
  )

  return {
    data: { parliamentarians },
    error,
    isLoading,
  }
}
