import { fetcher, safeFetcher } from '../fetch'
import useSWR from 'swr'
import { translator, useT } from 'src/components/Message'
import * as api from '../api'
import { branchIdPrefix, mapBranch } from '../mappers'
import { BranchId, Locale, MappedBranch, RawBranch } from '../../types'
import { Array, Option, Order, pipe, Schema } from 'effect'
import { Formatter } from 'src/utils/translate'

const branchesUrl = (locale: Locale) =>
  api.data(locale, 'data/interface/v1/json/table/branche/flat/list')

const branchesFetcher = safeFetcher(
  Schema.Struct({ data: Schema.Array(RawBranch) }),
)

const parseRawBranchesData =
  (formatter: Formatter) =>
  ({ data }: { data: ReadonlyArray<RawBranch> }): Array<MappedBranch> =>
    pipe(
      data,
      Array.sortWith((x) => x.name.toLocaleLowerCase(), Order.string),
      Array.map((x) => mapBranch(x, formatter)),
    )

export const useBranchen = ({
  locale,
}: {
  locale: Locale
}): {
  isLoading: boolean
  error: Error | undefined
  data: Array<MappedBranch>
} => {
  const t = useT(locale)

  const {
    data = Option.none(),
    error,
    isLoading,
  } = useSWR(branchesUrl(locale), branchesFetcher, { revalidateOnFocus: false })

  const branchen = pipe(
    data,
    Option.map(parseRawBranchesData(t)),
    Option.getOrElse(() => []),
  )

  return { data: branchen, error, isLoading }
}

export const fetchAllBranchen = async (locale: Locale) => {
  const url = branchesUrl(locale)
  const { data } = await fetcher(url)
  return data ?? []
}

export const getAllBranchen = async ({
  locale,
}: {
  locale: Locale
}): Promise<Array<MappedBranch>> => {
  const t = translator(locale)
  const data = await pipe(locale, branchesUrl, branchesFetcher)

  return pipe(
    data,
    Option.map(parseRawBranchesData(t)),
    Option.getOrElse(() => []),
  )
}

export const fetchBranche = async (locale: Locale, id: string) => {
  const url = api.data(
    locale,
    `data/interface/v1/json/table/branche/aggregated/id/${encodeURIComponent(id)}`,
  )
  const { data } = await fetcher(url)
  return data
}

export const getBranche = async ({
  locale,
  id,
}: {
  locale: Locale
  id: BranchId
}): Promise<MappedBranch | void> => {
  const t = translator(locale)
  const rawId = id.replace(branchIdPrefix, '')
  const data = await fetchBranche(locale, rawId)
  return data ? mapBranch(data, t) : undefined
}
