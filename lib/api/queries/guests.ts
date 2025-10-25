import useSWR from 'swr'
import * as api from '../api'
import { guestIdPrefix, mapGuest } from '../mappers'
import { translator, useT } from '../../../src/components/Message'
import { fetcher, safeFetcher } from '../fetch'
import { GuestId, Locale, MappedGuest, RawGuest } from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'
import { Formatter } from '../../translate'

const guestsUrl = (locale: Locale, query?: Record<string, string>) =>
  api.data(
    locale,
    'data/interface/v1/json/table/zutrittsberechtigung/flat/list',
    query,
  )

const guestsFetcher = safeFetcher(
  Schema.Struct({ data: Schema.Array(RawGuest) }),
)

const parseRawGuestsData =
  (formatter: Formatter) =>
  ({ data }: { data: ReadonlyArray<RawGuest> }): Array<MappedGuest> =>
    pipe(
      data,
      Array.map((x) => mapGuest(x, formatter)),
      Array.sortWith((x) => x.lastName.toLocaleLowerCase(), Order.string),
    )

export const useGuests = ({
  locale,
  query,
}: {
  locale: Locale
  query: Record<string, string>
}): {
  isLoading: boolean
  error: Error | undefined
  data: Array<MappedGuest>
} => {
  const t = useT(locale)

  const {
    data = Option.none(),
    error,
    isLoading,
  } = useSWR(guestsUrl(locale, query), guestsFetcher, {
    revalidateOnFocus: false,
  })

  const guests = pipe(
    data,
    Option.map(parseRawGuestsData(t)),
    Option.getOrElse(() => []),
  )

  return { data: guests, error, isLoading }
}

export const fetchAllGuests =
  (query?: Record<string, string>) => async (locale: Locale) => {
    const url = guestsUrl(locale, query)
    const { data } = await fetcher(url)
    return data ?? []
  }

export const getAllGuests = async ({
  locale,
  query,
}: {
  locale: Locale
  query?: Record<string, string>
}): Promise<Array<MappedGuest>> => {
  const t = translator(locale)
  const data = await guestsFetcher(guestsUrl(locale, query))

  return pipe(
    data,
    Option.map(parseRawGuestsData(t)),
    Option.getOrElse(() => []),
  )
}

export const fetchGuest = async (locale: Locale, id: string) => {
  const url = api.data(
    locale,
    `data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(id)}`,
  )
  const { data: guest } = await fetcher(url)

  // must load parliamentarian separately for some reason, guest only has an ID, not the data
  const parliamentarianUrl = api.data(
    locale,
    `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
      guest.parlamentarier_id,
    )}`,
  )

  const parliamentarian = await fetcher(parliamentarianUrl)

  guest.parlamentarier = parliamentarian.data

  return guest
}

export const getGuest = async ({
  locale,
  id,
}: {
  locale: Locale
  id: GuestId
}): Promise<MappedGuest | void> => {
  const t = translator(locale)
  const rawId = id.replace(guestIdPrefix, '')
  const data = await fetchGuest(locale, rawId)
  return data ? mapGuest(data, t) : undefined
}
