import { translator, useT } from '../../../src/components/Message'
import useSWR from 'swr'
import * as api from '../api'
import { mapParliamentarian, parliamentarianIdPrefix } from '../mappers'
import { fetcher, Query, safeFetcher } from '../fetch'
import { Locale, MappedParliamentarian, RawParliamentarian } from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'
import { Formatter } from 'src/utils/translate'

const parliamentariansUrl = <A>(locale: Locale, query?: Query<A>) =>
  api.data(
    locale,
    'data/interface/v1/json/table/parlamentarier/flat/list',
    query,
  )

const parliamentariansFetcher = (query?: Query<RawParliamentarian>) => {
  const schema = query
    ? RawParliamentarian.pipe(Schema.pick(...query.select_fields))
    : RawParliamentarian
  return safeFetcher(Schema.Struct({ data: Schema.Array(schema) }))
}

const parseRawParliamentariansData =
  (formatter: Formatter) =>
  ({
    data,
  }: {
    data: ReadonlyArray<RawParliamentarian>
  }): Array<MappedParliamentarian> =>
    pipe(
      data,
      Array.map((x) => mapParliamentarian(x, formatter)),
      Array.sortWith((x) => x.lastName.toLocaleLowerCase(), Order.string),
    )

export const useParliamentarians = ({
  locale,
  query,
}: {
  locale: Locale
  query: Query<RawParliamentarian>
}): {
  isLoading: boolean
  error: Error | undefined
  data: Array<MappedParliamentarian>
} => {
  const t = useT(locale)

  const {
    data = Option.none(),
    error,
    isLoading,
  } = useSWR(
    parliamentariansUrl(locale, query),
    parliamentariansFetcher(query),
    {
      revalidateOnFocus: false,
    },
  )

  const parliamentarians = pipe(
    data,
    Option.map(parseRawParliamentariansData(t)),
    Option.getOrElse(() => []),
  )

  return { data: parliamentarians, error, isLoading }
}

export const fetchAllParliamentarians = async (locale: Locale) => {
  const url = parliamentariansUrl(locale)
  const { data } = await fetcher(url)
  return data
}

export const getAllParliamentarians = async ({
  locale,
}: {
  locale: Locale
}): Promise<Array<MappedParliamentarian>> => {
  const t = translator(locale)
  const url = parliamentariansUrl(locale)
  const data = await parliamentariansFetcher()(url)
  return pipe(
    data,
    Option.map(parseRawParliamentariansData(t)),
    Option.getOrElse(() => []),
  )
}

export const fetchParliamentarian = async (locale: Locale, id: string) => {
  const url = api.data(
    locale,
    `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
      id,
    )}`,
  )
  const { data } = await fetcher(url)
  return data
}

export const getParliamentarian = async ({
  locale,
  id,
}: {
  locale: Locale
  id: string
}): Promise<MappedParliamentarian | void> => {
  const t = translator(locale)
  const rawId = id.replace(parliamentarianIdPrefix, '')
  // ToDo handle inactive – could send `includeInactive=1` but would need permission fixing on php side
  const data = await fetchParliamentarian(locale, rawId)
  return data ? mapParliamentarian(data, t) : undefined
}
