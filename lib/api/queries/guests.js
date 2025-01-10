import useSWR from 'swr'
import * as api from '../api'
import { ascending } from 'd3-array'
import {guestIdPrefix, mapGuest} from '../mappers'
import {translator, useT} from '../../../src/components/Message'
import { fetcher } from '../fetch'

export const useGuests = ({ locale, query }) => {
  const t = useT(locale)
  const url = api.data(
    locale,
    'data/interface/v1/json/table/zutrittsberechtigung/flat/list',
    query,
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  const guests = data?.data.map((g) => mapGuest(g, t)) ?? []

  // default: sort by lastname
  guests.sort((a, b) =>
    ascending(a.lastName.toLowerCase(), b.lastName.toLowerCase()),
  )

  return { data: { guests }, error, isLoading }
}

export const getAllGuests = async ({ locale, query }) => {
  const t = translator(locale)
  const url = api.data(
      locale,
      'data/interface/v1/json/table/zutrittsberechtigung/flat/list',
      query,
  )
  const data = await fetcher(url)

  const guests = data?.data.map((g) => mapGuest(g, t)) ?? []

  // default: sort by lastname
  guests.sort((a, b) =>
      ascending(a.lastName.toLowerCase(), b.lastName.toLowerCase()),
  )

  return { data: { guests } }
}

export const getGuest = async ({ locale, id }) => {
  const t = translator(locale)
  const rawId = id.replace(guestIdPrefix, '')
  const url = api.data(
      locale,
      `data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(
          rawId,
      )}`,
  )

  const guest = await fetcher(url)

  // must load parliamentarian separately for some reason, guest only has an ID, not the data
  const parliamentarianUrl = api.data(
      locale,
      `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
          guest.data?.parlamentarier_id,
      )}`,
  )

  const parliamentarian = await fetcher(parliamentarianUrl)

  guest.data.parlamentarier = parliamentarian.data

  return {
    data: { guest: mapGuest(guest.data, t) },
  }
}
