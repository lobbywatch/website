import { translator } from '../../../src/components/Message'
import * as api from '../api'
import { mapLobbyGroup } from '../mappers/mappers'
import { safeFetcher } from '../fetch'
import {
  LobbyGroupId,
  Locale,
  MappedLobbyGroup,
  RawLobbyGroup,
} from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'

export const lobbyGroupUrl = (locale: Locale, id: LobbyGroupId) =>
  api.data(
    locale,
    `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(id)}`,
  )

export const getLobbyGroup = async ({
  locale,
  id,
}: {
  locale: Locale
  id: LobbyGroupId
}): Promise<MappedLobbyGroup | void> => {
  const t = translator(locale)
  const url = lobbyGroupUrl(locale, id)
  return pipe(
    await safeFetcher(Schema.Struct({ data: RawLobbyGroup }))(url),
    Option.map(({ data }) => mapLobbyGroup(data, t)),
    Option.getOrElse(() => undefined),
  )
}

export const lobbyGroupsUrl = (locale: Locale) =>
  api.data(locale, 'data/interface/v1/json/table/interessengruppe/flat/list')

export const getAllLobbyGroups = async (
  locale: Locale,
): Promise<Array<MappedLobbyGroup>> => {
  const t = translator(locale)
  const url = lobbyGroupsUrl(locale)
  return pipe(
    await safeFetcher(Schema.Struct({ data: Schema.Array(RawLobbyGroup) }))(
      url,
    ),
    Option.map(({ data }) =>
      pipe(
        data,
        Array.sortWith((x) => x.name.toLocaleLowerCase(), Order.string),
        Array.map((x) => mapLobbyGroup(x, t)),
      ),
    ),
    Option.getOrElse(() => []),
  )
}
