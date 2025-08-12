import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'
import { ascending } from 'd3-array'
import * as api from '../api'
import { lobbyGroupIdPrefix, mapLobbyGroup } from '../mappers'
import { fetcher } from '../fetch'

export function useLobbyGroups({ locale }) {
  const t = useT(locale)

  const url = api.data(
    locale,
    'data/interface/v1/json/table/interessengruppe/flat/list',
  )
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  data?.data.sort((a, b) =>
    ascending(a.name.toLowerCase(), b.name.toLowerCase()),
  )

  return {
    data: {
      lobbyGroups:
        data?.data.map((lobbyGroup) => mapLobbyGroup(lobbyGroup, t)) ?? [],
    },
    error,
    isLoading,
  }
}

export const getAllLobbyGroups = async ({ locale }) => {
  const t = translator(locale)

  const url = api.data(
    locale,
    'data/interface/v1/json/table/interessengruppe/flat/list',
  )
  const data = await fetcher(url)

  data.data.sort((a, b) =>
    ascending(a.name.toLowerCase(), b.name.toLowerCase()),
  )

  return {
    data: {
      lobbyGroups:
        data.data.map((lobbyGroup) => mapLobbyGroup(lobbyGroup, t)) ?? [],
    },
  }
}

export const getLobbyGroup = async ({ locale, id }) => {
  const t = translator(locale)
  const rawId = id.replace(lobbyGroupIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )
  const data = await fetcher(url)

  return {
    data: { lobbyGroup: data.data && mapLobbyGroup(data.data, t) },
  }
}
