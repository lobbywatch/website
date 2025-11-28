import { safeFetcher } from '../fetch'
import { translator } from 'src/components/Message'
import * as api from '../api'
import { mapBranch } from '../mappers/mappers'
import type { BranchId, Locale, MappedBranch } from '../../domain'
import { RawBranch } from '../../domain'
import { Array, Option, Order, pipe, Schema } from 'effect'

export const branchUrl = (locale: Locale, id: BranchId) =>
  api.data(
    locale,
    `data/interface/v1/json/table/branche/aggregated/id/${encodeURIComponent(id)}`,
  )

export const getBranche = async ({
  locale,
  id,
}: {
  locale: Locale
  id: BranchId
}): Promise<MappedBranch | void> => {
  const t = translator(locale)
  const url = branchUrl(locale, id)
  return pipe(
    await safeFetcher(Schema.Struct({ data: RawBranch }))(url),
    Option.map(({ data }) => mapBranch(data, t)),
    Option.getOrElse(() => undefined),
  )
}

export const branchesUrl = (locale: Locale) =>
  api.data(locale, 'data/interface/v1/json/table/branche/flat/list')

export const getAllBranchen = async (
  locale: Locale,
): Promise<Array<MappedBranch>> => {
  const t = translator(locale)
  const url = branchesUrl(locale)
  return pipe(
    await safeFetcher(Schema.Struct({ data: Schema.Array(RawBranch) }))(url),
    Option.map(({ data }) =>
      pipe(
        data,
        Array.sortWith((x) => x.name.toLocaleLowerCase(), Order.string),
        Array.map((x) => mapBranch(x, t)),
      ),
    ),
    Option.getOrElse(() => []),
  )
}
