import useSWR from 'swr'
import * as api from '../api'
import { guestIdPrefix, mapGuest } from '../mappers'
import { useT } from '../../../src/components/Message'
import { fetcher } from '../fetch'

export const useGuest = ({ locale, id }) => {
  const t = useT(locale)
  const rawId = id.replace(guestIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )

  const guest = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  // must load parliamentarian separately for some reason, guest only has an ID, not the data
  const parliamentarianUrl = guest.data?.data?.parlamentarier_id
    ? api.data(
        locale,
        `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
          guest.data?.data?.parlamentarier_id,
        )}`,
      )
    : null
  const parliamentarian = useSWR(parliamentarianUrl, fetcher, {
    revalidateOnFocus: false,
  })

  if (!parliamentarian.data || parliamentarian.isLoading) {
    return { isLoading: true }
  }

  guest.data.data.parlamentarier = parliamentarian.data.data

  return {
    data: { guest: mapGuest(guest.data.data, t) },
    error: guest.error ?? parliamentarian.error,
    isLoading: guest.isLoading || parliamentarian.isLoading,
  }
}
