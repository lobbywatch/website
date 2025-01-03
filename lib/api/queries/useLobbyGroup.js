import * as api from '../api'
import { lobbyGroupIdPrefix, mapLobbyGroup } from '../mappers'
import { useT } from '../../../src/components/Message'
import useSWR from 'swr'
import { fetcher } from '../fetch'

export const useLobbyGroup = ({ locale, id }) => {
  const t = useT(locale)
  const rawId = id.replace(lobbyGroupIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data: { lobbyGroup: data?.data && mapLobbyGroup(data.data, t) },
    error,
    isLoading,
  }
}
