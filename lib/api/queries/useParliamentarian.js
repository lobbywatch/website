import { useT } from '../../../src/components/Message'
import useSWR from 'swr'
import * as api from '../api'
import { mapParliamentarian, parliamentarianIdPrefix } from '../mappers'
import { fetcher } from '../fetch'

export const useParliamentarian = ({ locale, id }) => {
  const t = useT(locale)
  const rawId = id.replace(parliamentarianIdPrefix, '')
  // ToDo handle inactive – could send `includeInactive=1` but would need permission fixing on php side
  const url = api.data(
    locale,
    `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: { parliamentarian: data?.data && mapParliamentarian(data.data, t) },
    error,
    isLoading,
  }
}
