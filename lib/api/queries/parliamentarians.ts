import { translator } from '../../../src/components/Message'
import * as api from '../api'
import { mapParliamentarian } from '../mappers'
import { Query, safeFetcher } from '../fetch'
import {
  Locale,
  MappedParliamentarian,
  ParliamentarianId,
  RawParliamentarian,
} from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'

export const parliamentarianUrl = (locale: Locale, id: ParliamentarianId) =>
  api.data(
    locale,
    `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(
      id,
    )}`,
  )

export const getParliamentarian = async ({
  locale,
  id,
}: {
  locale: Locale
  id: ParliamentarianId
}): Promise<MappedParliamentarian | void> => {
  const t = translator(locale)
  const url = parliamentarianUrl(locale, id)
  // ToDo handle inactive – could send `includeInactive=1` but would need permission fixing on php side
  return pipe(
    await safeFetcher(Schema.Struct({ data: RawParliamentarian }))(url),
    Option.map(({ data }) => mapParliamentarian(data, t)),
    Option.getOrElse(() => undefined),
  )
}

export const parliamentariansUrl = <A>(locale: Locale, query?: Query<A>) =>
  api.data(
    locale,
    'data/interface/v1/json/table/parlamentarier/flat/list',
    query,
  )

export const getAllParliamentarians = async (
  locale: Locale,
  query?: Query<RawParliamentarian>,
): Promise<Array<MappedParliamentarian>> => {
  const t = translator(locale)
  const url = parliamentariansUrl(locale, query)
  const schema = query
    ? RawParliamentarian.pipe(Schema.pick(...query.select_fields))
    : RawParliamentarian
  return pipe(
    await safeFetcher(Schema.Struct({ data: Schema.Array(schema) }))(url),
    Option.map(({ data }) =>
      pipe(
        data,
        Array.map((x) => mapParliamentarian(x, t)),
        Array.sortWith((x) => x.lastName.toLocaleLowerCase(), Order.string),
      ),
    ),
    Option.getOrElse(() => []),
  )
}
