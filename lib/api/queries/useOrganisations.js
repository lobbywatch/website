import * as api from '../api'
import { mapOrganisation } from '../mappers'
import { fetcher } from '../fetch'
import useSWR from 'swr'
import { useT } from '../../../src/components/Message'

export const useOrganisations = ({ locale, query }) => {
  const t = useT(locale)
  const url = api.data(
    locale,
    `data/interface/v1/json/table/organisation/flat/list`,
    query,
  )

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: {
      organisations: data?.data.map((org) => mapOrganisation(org, t)) ?? [],
    },
    error,
    isLoading,
  }
}
