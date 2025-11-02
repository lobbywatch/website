import useSWR from 'swr'
import { translator, useT } from '../../../src/components/Message'
import * as api from '../api'
import { lobbyGroupIdPrefix, mapLobbyGroup } from '../mappers'
import { fetcher, safeFetcher } from '../fetch'
import {
  LobbyGroupId,
  Locale,
  MappedLobbyGroup,
  RawLobbyGroup,
} from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'
import { Formatter } from 'src/utils/translate'

const lobbyGroupsUrl = (locale: Locale) =>
  api.data(locale, 'data/interface/v1/json/table/interessengruppe/flat/list')

export const fetchAllLobbyGroups = async (locale: Locale) => {
  const url = lobbyGroupsUrl(locale)
  const { data } = await fetcher(url)
  return data ?? []
}

const lobbyGroupFetcher = safeFetcher(
  Schema.Struct({ data: Schema.Array(RawLobbyGroup) }),
)

const parseRawLobbyGroupData =
  (formatter: Formatter) =>
  ({ data }: { data: ReadonlyArray<RawLobbyGroup> }): Array<MappedLobbyGroup> =>
    pipe(
      data,
      Array.sortWith((x) => x.name.toLocaleLowerCase(), Order.string),
      Array.map((x) => mapLobbyGroup(x, formatter)),
    )

export function useLobbyGroups({ locale }: { locale: Locale }): {
  isLoading: boolean
  error: Error | undefined
  data: Array<MappedLobbyGroup>
} {
  const t = useT(locale)

  const {
    data = Option.none(),
    error,
    isLoading,
  } = useSWR(lobbyGroupsUrl(locale), lobbyGroupFetcher, {
    revalidateOnFocus: false,
  })

  const lobbyGroups = pipe(
    data,
    Option.map(parseRawLobbyGroupData(t)),
    Option.getOrElse(() => []),
  )

  return { data: lobbyGroups, error, isLoading }
}

export const getAllLobbyGroups = async ({
  locale,
}: {
  locale: Locale
}): Promise<Array<MappedLobbyGroup>> => {
  const t = translator(locale)

  const data = await pipe(locale, lobbyGroupsUrl, lobbyGroupFetcher)

  return pipe(
    data,
    Option.map(parseRawLobbyGroupData(t)),
    Option.getOrElse(() => []),
  )
}

export const fetchLobbyGroup = async (locale: Locale, id: string) => {
  const url = api.data(
    locale,
    `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(id)}`,
  )
  const { data } = await fetcher(url)
  return data
}

export const getLobbyGroup = async ({
  locale,
  id,
}: {
  locale: Locale
  id: LobbyGroupId
}): Promise<MappedLobbyGroup | void> => {
  const t = translator(locale)
  const rawId = id.replace(lobbyGroupIdPrefix, '')
  const data = await fetchLobbyGroup(locale, rawId)
  return data ? mapLobbyGroup(data, t) : undefined
}
