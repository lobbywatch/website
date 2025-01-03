import { fetcher } from '../fetch'
import useSWR from 'swr'
import { useT } from 'src/components/Message'
import * as api from '../api'
import { ascending } from 'd3-array'
import { mapBranch } from '../mappers'

export const useBranchen = ({ locale }) => {
  const t = useT(locale)
  const url = api.data(locale, 'data/interface/v1/json/table/branche/flat/list')

  const { data, error, isLoading } = useSWR(url, fetcher, {revalidateOnFocus: false})

  // default: sort by name
  data?.data.sort((a, b) =>
    ascending(a.name.toLowerCase(), b.name.toLowerCase()),
  )

  return {
    data: { branchen: data?.data.map((l) => mapBranch(l, t)) ?? [] },
    error,
    isLoading,
  }
}
