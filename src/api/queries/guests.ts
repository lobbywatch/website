import * as api from '../api'
import { mapGuest } from '../mappers/mappers'
import { translator } from 'src/components/Message'
import { fetcher, Query, safeFetcher } from '../fetch'
import { GuestId, Locale, MappedGuest, RawGuest } from '../../domain'
import { Array, Option, Order, pipe, Schema } from 'effect'
import { parliamentarianUrl } from './parliamentarians'

export const guestUrl = (locale: Locale, id: GuestId) =>
  api.data(
    locale,
    `data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(id)}`,
  )

export const fetchGuest = async (locale: Locale, id: GuestId) => {
  const url = guestUrl(locale, id)
  const { data } = await fetcher(url)

  // must load parliamentarian separately for some reason, guest only has an ID, not the data
  const parliamentarian = await fetcher(
    parliamentarianUrl(locale, data.parlamentarier_id),
  )
  data.parlamentarier = parliamentarian.data
  return data
}

export const getGuest = async ({
  locale,
  id,
}: {
  locale: Locale
  id: GuestId
}): Promise<MappedGuest | void> => {
  const t = translator(locale)
  const data = await fetchGuest(locale, id)

  return pipe(
    Schema.decodeUnknownOption(RawGuest)(data),
    Option.map((data) => mapGuest(data, t)),
    Option.getOrElse(() => undefined),
  )
}

export const guestsUrl = (locale: Locale, query?: Query<RawGuest>) =>
  api.data(
    locale,
    'data/interface/v1/json/table/zutrittsberechtigung/flat/list',
    query,
  )

export const getAllGuests = async (
  locale: Locale,
  query?: Query<RawGuest>,
): Promise<Array<MappedGuest>> => {
  const t = translator(locale)
  const url = guestsUrl(locale, query)
  const schema = query
    ? RawGuest.pipe(Schema.pick(...query.select_fields))
    : RawGuest
  return pipe(
    await safeFetcher(Schema.Struct({ data: Schema.Array(schema) }))(url),
    Option.map(({ data }) =>
      pipe(
        data,
        Array.map((x) => mapGuest(x, t)),
        Array.sortWith((x) => x.lastName.toLocaleLowerCase(), Order.string),
      ),
    ),
    Option.getOrElse(() => []),
  )
}
