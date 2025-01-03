import useSWR from 'swr'
import * as api from '../api'
import { ascending } from 'd3-array'
import { mapGuest } from '../mappers'
import { useT } from '../../../src/components/Message'
import { fetcher } from '../fetch'

export const useGuests = ({ locale, query }) => {
  const t = useT(locale)
  const url = api.data(
    locale,
    'data/interface/v1/json/table/zutrittsberechtigung/flat/list',
    query,
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  const guests = data?.data.map((g) => mapGuest(g, t)) ?? []

  // default: sort by lastname
  guests.sort((a, b) =>
    ascending(a.lastName.toLowerCase(), b.lastName.toLowerCase()),
  )

  return { data: { guests }, error, isLoading }
}
