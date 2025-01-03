import * as api from '../api'
import { mapOrganisation, orgIdPrefix } from '../mappers'
import { fetcher } from '../fetch'
import useSWR from 'swr'
import { useT } from '../../../src/components/Message'

export const useOrganisation = ({ locale, id }) => {
  const t = useT(locale)
  const rawId = id.replace(orgIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: { organisation: data?.data && mapOrganisation(data.data, t) },
    error,
    isLoading,
  }
}
