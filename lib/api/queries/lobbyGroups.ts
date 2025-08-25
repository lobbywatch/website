import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'
import { ascending } from 'd3-array'
import * as api from '../api'
import { lobbyGroupIdPrefix, mapLobbyGroup } from '../mappers'
import { fetcher } from '../fetch'
import { LobbyGroupId, Locale, MappedLobbyGroup } from '../../types'
import { Option, pipe } from 'effect'

export function useLobbyGroups({ locale }: { locale: Locale }): {
  isLoading: boolean
  error: Error | undefined
  data: { lobbyGroups: MappedLobbyGroup }
} {
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

export const getAllLobbyGroups = async ({
  locale,
}: {
  locale: Locale
}): Promise<{ data: { lobbyGroups: MappedLobbyGroup } }> => {
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

export const getLobbyGroup = async ({
  locale,
  id,
}: {
  locale: Locale
  id: LobbyGroupId
}): Promise<Option.Option<MappedLobbyGroup>> => {
  const t = translator(locale)
  const rawId = id.replace(lobbyGroupIdPrefix, '')
  const url = api.data(
    locale,
    `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(
      rawId,
    )}`,
  )
  const data = await fetcher(url)

  return pipe(
    Option.fromNullable(data.data),
    Option.map((x) => mapLobbyGroup(x, t)),
  )
}
