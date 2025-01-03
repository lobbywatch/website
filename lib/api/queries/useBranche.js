import { useT } from 'src/components/Message'
import { branchIdPrefix, mapBranch } from '../mappers'
import * as api from '../api'
import { fetcher } from '../fetch'
import useSWR from 'swr'

export const useBranche = ({ locale, id }) => {
  const t = useT(locale)

  const rawId = id.replace(branchIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/branche/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: { branche: data?.data && mapBranch(data.data, t) },
    error,
    isLoading,
  }
}
