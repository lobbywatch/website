import * as api from '../api'
import { mapOrganisation, orgIdPrefix } from '../mappers'
import { fetcher, Query, safeFetcher } from '../fetch'
import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'
import {
  Locale,
  MappedOrganisation,
  OrganisationId,
  RawOrganisation,
} from '../../types'
import { Array, Option, pipe, Schema } from 'effect'
import { Formatter } from 'src/utils/translate'

const fetchOrganisationsUrl = <A>(locale: Locale, query: Query<A>) =>
  api.data(locale, `data/interface/v1/json/table/organisation/flat/list`, query)

const organisationsFetcher = (query?: Query<RawOrganisation>) => {
  const schema = query
    ? RawOrganisation.pipe(Schema.pick(...query.select_fields))
    : RawOrganisation
  return safeFetcher(Schema.Struct({ data: Schema.Array(schema) }))
}

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
  (query: Query<RawOrganisation>) => async (locale: Locale) => {
    const url = fetchOrganisationsUrl(locale, query)
    const { data } = await fetcher(url)
    return data ?? []
  }

export const useOrganisations = ({
  locale,
  query,
}: {
  locale: Locale
  query: Query<RawOrganisation>
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
  } = useSWR(
    fetchOrganisationsUrl(locale, query),
    organisationsFetcher(query),
    { revalidateOnFocus: false },
  )

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
