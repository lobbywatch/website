import { Schema } from 'effect'

/**
 * RawParliamentarian
 */
export interface RawParliamentarian
  extends Schema.Struct.Type<typeof rawParliamentarianFields> {
  readonly interessenbindungen?: ReadonlyArray<RawConnection>
  readonly verguetungen_pro_jahr?: ReadonlyArray<RawVerguetung>
  readonly zutrittsberechtigungen?: ReadonlyArray<RawGuest>
}

export interface RawParliamentarianEncoded
  extends Schema.Struct.Encoded<typeof rawParliamentarianFields> {
  readonly interessenbindungen?: ReadonlyArray<RawConnectionEncoded>
  readonly verguetungen_pro_jahr?: ReadonlyArray<RawVerguetungEncoded>
  readonly zutrittsberechtigungen?: ReadonlyArray<RawGuestEncoded>
}

const rawParliamentarianFields = {
  aktiv: Schema.NumberFromString,
  anzahl_kinder: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  art: Schema.optional(
    Schema.Literal(
      'beirat',
      'mitglied',
      'vorstand',
      'geschaeftsfuehrend',
      'taetig',
    ),
  ),
  beruf: Schema.String,
  beruf_interessengruppe_id: Schema.optionalWith(Schema.String, {
    nullable: true,
  }),
  beschreibung: Schema.optionalWith(Schema.String, { nullable: true }),
  facebook_name: Schema.optionalWith(Schema.String, { nullable: true }),
  facebook_url: Schema.optional(Schema.String),
  freigabe_datum_unix: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  funktion: Schema.optional(Schema.String),
  geburtstag: Schema.String,
  geschlecht: Schema.String,
  homepage: Schema.optionalWith(Schema.String, { nullable: true }),
  id: Schema.String,
  im_rat_bis_unix: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  im_rat_seit_unix: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  in_kommission: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        name: Schema.String,
        abkuerzung: Schema.String,
      }),
    ),
  ),
  kanton_name: Schema.optional(Schema.String),
  kommissionen_abkuerzung: Schema.String,
  kommissionen_namen: Schema.String,
  linkedin_profil_url: Schema.optionalWith(Schema.String, { nullable: true }),
  nachname: Schema.String,
  parlament_biografie_id: Schema.String,
  parlament_biografie_url: Schema.String,
  parlament_number: Schema.optional(Schema.NumberFromString),
  parlamentarier_id: Schema.String,
  partei: Schema.optional(Schema.String),
  partei_name: Schema.optional(Schema.String),
  parteifunktion: Schema.String,
  ratstyp: Schema.optional(Schema.String),
  twitter_name: Schema.optionalWith(Schema.String, { nullable: true }),
  twitter_url: Schema.optional(Schema.String),
  updated_date_unix: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  verguetungstransparenz_beurteilung: Schema.optionalWith(
    Schema.Literal('ja', 'nein', 'teilweise'),
    {
      nullable: true,
    },
  ),
  verguetungstransparenz_beurteilung_stichdatum: Schema.optionalWith(
    Schema.String,
    { nullable: true },
  ),
  vertretene_bevoelkerung: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  vorname: Schema.String,
  wikidata_item_url: Schema.optional(Schema.String),
  wikipedia: Schema.optionalWith(Schema.String, { nullable: true }),
  zivilstand: Schema.optionalWith(Schema.String, { nullable: true }),
  zweiter_vorname: Schema.optionalWith(Schema.String, { nullable: true }),
}

export const RawParliamentarian = Schema.Struct({
  ...rawParliamentarianFields,
  interessenbindungen: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawConnection, RawConnectionEncoded> => RawConnection,
      ),
    ),
  ),
  verguetungen_pro_jahr: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawVerguetung, RawVerguetungEncoded> => RawVerguetung,
      ),
    ),
  ),
  zutrittsberechtigungen: Schema.optional(
    Schema.Array(
      Schema.suspend((): Schema.Schema<RawGuest, RawGuestEncoded> => RawGuest),
    ),
  ),
}).annotations({ identifier: 'RawParliamentarian' })

// -------------------------------------------------------------------------------------------------

export type RawFunction = {
  art?: string
  funktion_im_gremium?: string // TODO
  gender?: string
  rechtsform?: string
}

// -------------------------------------------------------------------------------------------------

/**
 * RawGuest
 */
export interface RawGuest extends Schema.Struct.Type<typeof rawGuestFields> {
  mandate?: ReadonlyArray<RawConnection>
  parlamentarier?: RawParliamentarian
}

export interface RawGuestEncoded
  extends Schema.Struct.Encoded<typeof rawGuestFields> {
  mandate?: ReadonlyArray<RawConnectionEncoded>
  parlamentarier?: RawParliamentarianEncoded
}

const rawGuestFields = {
  person_id: Schema.String,
  beruf: Schema.optionalWith(Schema.String, { nullable: true }),
  beschreibung: Schema.optionalWith(Schema.String, {
    exact: true,
    nullable: true,
  }),
  facebook_name: Schema.optionalWith(Schema.String, { nullable: true }),
  facebook_url: Schema.optional(Schema.String),
  freigabe_datum_unix: Schema.NumberFromString,
  funktion: Schema.String,
  geschlecht: Schema.optionalWith(Schema.String, { nullable: true }),
  homepage: Schema.optionalWith(Schema.String, { nullable: true }),
  id: Schema.String,
  linkedin_profil_url: Schema.optionalWith(Schema.String, { nullable: true }),
  nachname: Schema.String,
  twitter_name: Schema.optionalWith(Schema.String, { nullable: true }),
  twitter_url: Schema.optional(Schema.String),
  updated_date_unix: Schema.NumberFromString,
  vorname: Schema.String,
  wikidata_item_url: Schema.optional(Schema.String),
  wikipedia: Schema.optional(Schema.String),
  zweiter_vorname: Schema.optionalWith(Schema.String, { nullable: true }),
  bis_unix: Schema.optionalWith(Schema.JsonNumber, { nullable: true }),
}

export const RawGuest = Schema.Struct({
  ...rawGuestFields,
  mandate: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawConnection, RawConnectionEncoded> => RawConnection,
      ),
    ),
  ),
  parlamentarier: Schema.optional(
    Schema.suspend(
      (): Schema.Schema<RawParliamentarian, RawParliamentarianEncoded> =>
        RawParliamentarian,
    ),
  ),
}).annotations({ identifier: 'RawGuest' })

// -------------------------------------------------------------------------------------------------

export interface RawLobbyGroup
  extends Schema.Struct.Type<typeof rawLobbyGroupFields> {
  readonly connections?: ReadonlyArray<RawConnection>
  readonly organisationen?: ReadonlyArray<RawOrganisation>
  readonly parlamentarier?: ReadonlyArray<RawParliamentarian>
  readonly zutrittsberechtigte?: ReadonlyArray<RawGuest>
  readonly zwischen_organisationen?: ReadonlyArray<RawOrganisation>
}

export interface RawLobbyGroupEncoded
  extends Schema.Struct.Encoded<typeof rawLobbyGroupFields> {
  readonly connections?: ReadonlyArray<RawConnectionEncoded>
  readonly organisationen?: ReadonlyArray<RawOrganisationEncoded>
  readonly parlamentarier?: ReadonlyArray<RawParliamentarianEncoded>
  readonly zutrittsberechtigte?: ReadonlyArray<RawGuestEncoded>
  readonly zwischen_organisationen?: ReadonlyArray<RawOrganisationEncoded>
}

const rawLobbyGroupFields = {
  alias_namen: Schema.optionalWith(Schema.String, { nullable: true }),
  anzeige_name: Schema.String,
  anzeige_name_mixed: Schema.String,
  beschreibung: Schema.optionalWith(Schema.String, { nullable: true }),
  branche: Schema.String,
  branche_id: Schema.String,
  freigabe_datum_unix: Schema.NumberFromString,
  id: Schema.String,
  kommission1_abkuerzung: Schema.String,
  kommission1_id: Schema.String,
  kommission1_name: Schema.String,
  kommission2_abkuerzung: Schema.String,
  kommission2_id: Schema.String,
  kommission2_name: Schema.String,
  name: Schema.String,
  updated_date_unix: Schema.NumberFromString,
  wikipedia: Schema.optionalWith(Schema.String, { nullable: true }),
  // Exists when wikidata_qid is set
  wikidata_item_url: Schema.optional(Schema.String),
}

export const RawLobbyGroup = Schema.Struct({
  ...rawLobbyGroupFields,
  connections: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawConnection, RawConnectionEncoded> => RawConnection,
      ),
    ),
  ),
  organisationen: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawOrganisation, RawOrganisationEncoded> =>
          RawOrganisation,
      ),
    ),
  ),
  parlamentarier: Schema.optional(Schema.Array(RawParliamentarian)),
  zutrittsberechtigte: Schema.optional(Schema.Array(RawGuest)),
  zwischen_organisationen: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawOrganisation, RawOrganisationEncoded> =>
          RawOrganisation,
      ),
    ),
  ),
}).annotations({ identifier: 'RawLobbyGroup' })

// -------------------------------------------------------------------------------------------------

/**
 * RawConnection
 */
export interface RawConnection
  extends Schema.Struct.Type<typeof rawConnectionFields> {
  parlamentarier?: ReadonlyArray<RawParliamentarian>
}

export interface RawConnectionEncoded
  extends Schema.Struct.Encoded<typeof rawConnectionFields> {
  parlamentarier?: ReadonlyArray<RawParliamentarianEncoded>
}

const WirksamkeitIndex = Schema.transform(
  Schema.Literal('1', '2', '3'),
  Schema.Literal(1, 2, 3),
  {
    strict: true,
    decode: (x) => +x as 1 | 2 | 3,
    encode: (x) => String(x) as '1' | '2' | '3',
  },
)

const rawConnectionFields = {
  art: Schema.String,
  beschreibung: Schema.optionalWith(Schema.String, { nullable: true }),
  id: Schema.optional(Schema.String),
  interessengruppe: Schema.optionalWith(Schema.String, { nullable: true }),
  organisation_id: Schema.optional(Schema.String),
  organisation_name: Schema.optional(Schema.String),
  parlamentarier_name: Schema.optional(Schema.String),
  parlamentarier_id: Schema.optional(Schema.String),
  rechtsform: Schema.optional(Schema.String),
  verguetung: Schema.optionalWith(Schema.NumberFromString, { nullable: true }),
  verguetung_beschreibung: Schema.optionalWith(Schema.String, {
    nullable: true,
  }),
  verguetung_jahr: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  verguetungen_pro_jahr: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawVerguetung, RawVerguetungEncoded> => RawVerguetung,
      ),
    ),
  ),
  wirksamkeit_index: Schema.optional(WirksamkeitIndex),
  ziel_organisation_id: Schema.optional(Schema.String),
  ziel_organisation_name: Schema.optional(Schema.String),
  connector_organisation_id: Schema.optional(Schema.String),
  zwischen_organisation_id: Schema.optionalWith(Schema.String, {
    nullable: true,
  }),
  zwischen_organisation_art: Schema.optionalWith(Schema.String, {
    nullable: true,
  }),
  person_id: Schema.optionalWith(Schema.String, { nullable: true }),
  zutrittsberechtigter: Schema.optionalWith(Schema.String, { nullable: true }),
  funktion_im_gremium: Schema.optionalWith(
    Schema.Literal('mitglied', 'praesident', 'vizepraesident'),
    { nullable: true },
  ),
}

export const RawConnection = Schema.Struct({
  ...rawConnectionFields,
  parlamentarier: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawParliamentarian, RawParliamentarianEncoded> =>
          RawParliamentarian,
      ),
    ),
  ),
}).annotations({ identifier: 'RawConnection' })

// -------------------------------------------------------------------------------------------------

export type RawVerguetung = Schema.Schema.Type<typeof RawVerguetung>

export type RawVerguetungEncoded = Schema.Schema.Encoded<typeof RawVerguetung>

export const RawVerguetung = Schema.Struct({
  beschreibung: Schema.optionalWith(Schema.String, { nullable: true }),
  jahr: Schema.NumberFromString,
  verguetung: Schema.optional(Schema.NumberFromString),
}).annotations({ identifier: 'RawVerguetung' })

// -------------------------------------------------------------------------------------------------

export interface RawBranch extends Schema.Struct.Type<typeof rawBranchFields> {
  connections?: ReadonlyArray<RawConnection>
  interessengruppe: ReadonlyArray<RawLobbyGroup>
  organisationen?: ReadonlyArray<RawOrganisation>
  parlamentarier?: ReadonlyArray<RawParliamentarian>
}

export interface RawBranchEncoded
  extends Schema.Struct.Encoded<typeof rawBranchFields> {
  connections?: ReadonlyArray<RawConnectionEncoded>
  interessengruppe: ReadonlyArray<RawLobbyGroupEncoded>
  organisationen?: ReadonlyArray<RawOrganisationEncoded>
  parlamentarier?: ReadonlyArray<RawParliamentarianEncoded>
}

const rawBranchFields = {
  angaben: Schema.optionalWith(Schema.String, { nullable: true }),
  anzeige_name: Schema.String,
  anzeige_name_mixed: Schema.String,
  beschreibung: Schema.String,
  freigabe_datum_unix: Schema.NumberFromString,
  id: Schema.String,
  kommission1_abkuerzung: Schema.String,
  kommission1_id: Schema.String,
  kommission1_name: Schema.String,
  kommission2_abkuerzung: Schema.String,
  kommission2_id: Schema.String,
  kommission2_name: Schema.String,
  kommission_id: Schema.String,
  name: Schema.String,
  symbol_dateierweiterung: Schema.optionalWith(Schema.String, {
    nullable: true,
  }),
  symbol_dateiname: Schema.optionalWith(Schema.String, { nullable: true }),
  symbol_wo_ext: Schema.optional(Schema.String),
  symbol_klein_rel: Schema.String,
  symbol_mime_type: Schema.optionalWith(Schema.String, { nullable: true }),
  symbol_path: Schema.String,
  symbol_rel: Schema.optionalWith(Schema.String, { nullable: true }),
  symbol_url: Schema.String,
  technischer_name: Schema.String,
  updated_date_unix: Schema.NumberFromString,
  wikipedia: Schema.optionalWith(Schema.String, { nullable: true }),
  wikidata_item_url: Schema.optional(Schema.String),
}

export const RawBranch = Schema.Struct({
  ...rawBranchFields,
  connections: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawConnection, RawConnectionEncoded> => RawConnection,
      ),
    ),
  ),
  interessengruppe: Schema.optionalWith(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawLobbyGroup, RawLobbyGroupEncoded> => RawLobbyGroup,
      ),
    ),
    { default: () => [] },
  ),
  organisationen: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawOrganisation, RawOrganisationEncoded> =>
          RawOrganisation,
      ),
    ),
  ),
  parlamentarier: Schema.optional(
    Schema.Array(
      Schema.suspend(
        (): Schema.Schema<RawParliamentarian, RawParliamentarianEncoded> =>
          RawParliamentarian,
      ),
    ),
  ),
}).annotations({ identifier: 'RawBranch' })

// -------------------------------------------------------------------------------------------------

export type RawOrganisation = Schema.Schema.Type<typeof RawOrganisation>

export type RawOrganisationEncoded = Schema.Schema.Encoded<
  typeof RawOrganisation
>

export const RawOrganisation = Schema.Struct({
  abkuerzung: Schema.optionalWith(Schema.String, { nullable: true }),
  adresse_plz: Schema.optionalWith(Schema.String, { nullable: true }),
  beschreibung: Schema.optionalWith(Schema.String, { nullable: true }),
  beziehungen: Schema.optionalWith(Schema.Array(RawConnection), {
    default: () => [],
  }),
  freigabe_datum_unix: Schema.optionalWith(Schema.NumberFromString, {
    nullable: true,
  }),
  homepage: Schema.optionalWith(Schema.String, { nullable: true }),
  id: Schema.String,
  interessengruppe: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe1: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe2: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe2_id: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe3: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe3_id: Schema.optionalWith(Schema.String, { nullable: true }),
  interessengruppe_id: Schema.optionalWith(Schema.String, { nullable: true }),
  land_iso2: Schema.optionalWith(Schema.String, { nullable: true }),
  name: Schema.String,
  ort: Schema.optionalWith(Schema.String, { nullable: true }),
  parlamentarier: Schema.optionalWith(Schema.Array(RawParliamentarian), {
    default: () => [],
  }),
  rechtsform: Schema.String,
  twitter_name: Schema.optionalWith(Schema.String, { nullable: true }),
  twitter_url: Schema.optional(Schema.String),
  uid: Schema.optionalWith(Schema.String, { nullable: true }),
  updated_date_unix: Schema.optional(Schema.NumberFromString),
  wikidata_item_url: Schema.optional(Schema.String),
  wikipedia: Schema.optionalWith(Schema.String, { nullable: true }),
  zutrittsberechtigte: Schema.optionalWith(Schema.Array(RawGuest), {
    default: () => [],
  }),
}).annotations({ identifier: 'RawOrganisation' })
