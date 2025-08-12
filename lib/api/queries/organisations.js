import * as api from '../api'
import { mapOrganisation, orgIdPrefix } from '../mappers'
import { fetcher } from '../fetch'
import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'

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

export const getOrganisation = async ({ locale, id }) => {
  const t = translator(locale)
  const rawId = id.replace(orgIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )

  const data = await fetcher(url)

  return {
    data: { organisation: data?.data && mapOrganisation(data.data, t) },
  }
}
