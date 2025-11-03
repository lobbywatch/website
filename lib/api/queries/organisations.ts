import * as api from '../api'
import { mapOrganisation } from '../mappers/mappers'
import { Query, safeFetcher } from '../fetch'
import { translator } from '../../../src/components/Message'
import {
  Locale,
  MappedOrganisation,
  OrganisationId,
  RawOrganisation,
} from '../../../src/domain'
import { Array, Option, pipe, Schema } from 'effect'

export const organisationUrl = <A>(locale: Locale, id: OrganisationId) =>
  api.data(
    locale,
    `data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(id)}`,
  )

export const getOrganisation = async ({
  locale,
  id,
}: {
  locale: Locale
  id: OrganisationId
}): Promise<MappedOrganisation | void> => {
  const t = translator(locale)
  const url = organisationUrl(locale, id)
  return pipe(
    await safeFetcher(Schema.Struct({ data: RawOrganisation }))(url),
    Option.map(({ data }) => mapOrganisation(data, t)),
    Option.getOrElse(() => undefined),
  )
}

export const organisationsUrl = <A>(locale: Locale, query?: Query<A>) =>
  api.data(locale, `data/interface/v1/json/table/organisation/flat/list`, query)

export const getAllOrganisations = async (
  locale: Locale,
  query?: Query<RawOrganisation>,
) => {
  const t = translator(locale)
  const url = organisationsUrl(locale, query)
  const schema = query
    ? RawOrganisation.pipe(Schema.pick(...query.select_fields))
    : RawOrganisation
  return pipe(
    await safeFetcher(Schema.Struct({ data: Schema.Array(schema) }))(url),
    Option.map(({ data }) =>
      pipe(
        data,
        Array.map((x) => mapOrganisation(x, t)),
      ),
    ),
    Option.getOrElse(() => []),
  )
}
