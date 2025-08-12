import { translator, useT } from '../../../src/components/Message'
import useSWR from 'swr'
import * as api from '../api'
import { mapParliamentarian, parliamentarianIdPrefix } from '../mappers'
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

export const getAllParliamentarians = async ({ locale, query }) => {
  const t = translator(locale)

  const url = api.data(
    locale,
    'data/interface/v1/json/table/parlamentarier/flat/list',
    query,
  )
  const data = await fetcher(url)

  const parliamentarians = data?.data.map((p) => mapParliamentarian(p, t)) ?? []

  // default: sort by lastname
  parliamentarians.sort((a, b) =>
    ascending(a.lastName.toLowerCase(), b.lastName.toLowerCase()),
  )

  return {
    data: { parliamentarians },
  }
}

export const getParliamentarian = async ({ locale, id }) => {
  const t = translator(locale)
  const rawId = id.replace(parliamentarianIdPrefix, '')
  // ToDo handle inactive – could send `includeInactive=1` but would need permission fixing on php side
  const url = api.data(
    locale,
    `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )
  const data = await fetcher(url)

  return {
    data: { parliamentarian: data.data && mapParliamentarian(data.data, t) },
  }
}
