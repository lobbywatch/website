import * as api from '../api'
import { mapOrganisation, orgIdPrefix } from '../mappers'
import { fetcher, safeFetcher } from '../fetch'
import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'
import {
  Locale,
  MappedOrganisation,
  OrganisationId,
  RawOrganisation,
} from '../../types'
import { Array, Option, pipe, Schema } from 'effect'
import { Formatter } from '../../translate'

const fetchOrganisationsUrl = (locale: Locale, query: Record<string, string>) =>
  api.data(locale, `data/interface/v1/json/table/organisation/flat/list`, query)

const organisationsFetcher = safeFetcher(
  Schema.Struct({ data: Schema.Array(RawOrganisation) }),
)

const parseRawOrganisationsData =
  (formatter: Formatter) =>
  ({
    data,
  }: {
    data: ReadonlyArray<RawOrganisation>
  }): Array<MappedOrganisation> =>
    pipe(
      data,
      Array.map((x) => mapOrganisation(x, formatter)),
    )

export const fetchAllOrganisations =
  (query: Record<string, string>) => async (locale: Locale) => {
    const url = fetchOrganisationsUrl(locale, query)
    const { data } = await fetcher(url)
    return data ?? []
  }

export const useOrganisations = ({
  locale,
  query,
}: {
  locale: Locale
  query: Record<string, string>
}): {
  isLoading: boolean
  error: Error | undefined
  data: Array<MappedOrganisation>
} => {
  const t = useT(locale)

  const {
    data = Option.none(),
    error,
    isLoading,
  } = useSWR(fetchOrganisationsUrl(locale, query), organisationsFetcher, {
    revalidateOnFocus: false,
  })

  const organisations = pipe(
    data,
    Option.map(parseRawOrganisationsData(t)),
    Option.getOrElse(() => []),
  )

  return { data: organisations, error, isLoading }
}

export const fetchOrganisation = async (locale: Locale, id: string) => {
  const url = api.data(
    locale,
    `data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(id)}`,
  )
  const { data } = await fetcher(url)
  return data
}

export const getOrganisation = async ({
  locale,
  id,
}: {
  locale: Locale
  id: OrganisationId
}): Promise<MappedOrganisation | void> => {
  const t = translator(locale)
  const rawId = id.replace(orgIdPrefix, '')
  const data = await fetchOrganisation(locale, rawId)
  return data ? mapOrganisation(data, t) : undefined
}
