import { Schema } from 'effect'

type MappedPerson = {
  facebook_name: string
  facebook_url: string
  firstName: string
  gender: string
  lastName: string
  linkedin_url: string
  middleName: string
  name: string
  occupation: string
  twitter_name: string
  twitter_url: string
  website: string
  wikidata_url: string
  wikipedia_url: string
}

export type RawParliamentarian = {
  aktiv: number
  anzahl_kinder: number
  art: 'mitglied'
  beruf: string
  beruf_interessengruppe_id: string
  beschreibung: string
  facebook_name: string
  facebook_url: string
  freigabe_datum_unix: number
  funktion: string
  geburtstag: string
  geschlecht: string
  homepage: string
  id: string
  im_rat_bis_unix: number
  im_rat_seit_unix: number
  in_kommission: Array<{
    id: string
    name: string
    abkuerzung: string
  }>
  interessenbindungen: Array<RawConnection>
  kanton_name: string
  kommissionen_abkuerzung: string
  kommissionen_namen: string
  linkedin_profil_url: string
  nachname: string
  parlament_biografie_id: string
  parlament_biografie_url: string
  parlament_number: number
  parlamentarier_id: string
  partei: string
  partei_name: string
  parteifunktion: string
  ratstyp: string
  twitter_name: string
  twitter_url: string
  updated_date_unix: number
  verguetungen_pro_jahr: Array<RawVerguetung>
  verguetungstransparenz_beurteilung: string
  verguetungstransparenz_beurteilung_stichdatum: string
  vertretene_bevoelkerung: number
  vorname: string
  wikidata_item_url: string
  wikipedia: string
  zivilstand: string
  zutrittsberechtigungen: Array<RawGuest>
  zweiter_vorname: string
}

export type MappedParliamentarian = MappedPerson & {
  __typename: 'Parliamentarian'
  active: boolean
  readonly age: number
  canton: string
  children: number | null
  readonly civilStatus: string
  commissions: Array<{
    id: string
    name: string
    abbr: string
  }>
  compensationTransparence: {
    dueDate: string
    isTansparent: string // compensationTransparenceStateMap
  } | null
  connections?: Array<MappedConnection>
  council: string
  councilExitDate?: string
  councilJoinDate: string
  readonly councilTenure: number
  readonly councilTitle: string
  dateOfBirth: string
  guests: Array<MappedGuest>
  id: string
  kommissionen_abkuerzung: string
  kommissionen_namen: string
  parlament_biografie_url: string
  parliamentId: string
  partyMembership: {
    function: string
    party: {
      name: string
      wikipedia_url: string
      wikidata_url: string
      abbr: string
      twitter_name: string
      twitter_url: string
    }
  } | null
  portrait: string
  published: string
  publishedIso: string
  represents: number
  updated: string
  updatedIso: string
}

export type RawFunction = {
  art?: string
  funktion_im_gremium?: string // TODO
  gender: string
  rechtsform: string
}

export type RawGuest = {
  person_id: string
  beruf: string
  beschreibung: string
  facebook_name: string
  facebook_url: string
  freigabe_datum_unix: number
  funktion: string
  geschlecht: string
  homepage: string
  id: string
  linkedin_profil_url: string
  mandate: Array<RawConnection>
  nachname: string
  parlamentarier: RawParliamentarian
  twitter_name: string
  twitter_url: string
  updated_date_unix: number
  vorname: string
  wikidata_item_url: string
  wikipedia: string
  zweiter_vorname: string
}

export type MappedGuest = {
  __typename: 'Guest'
  connections?: Array<MappedConnection>
  facebook_name: string
  facebook_url: string
  firstName: string
  function: string
  gender: string
  id: string
  lastName: string
  linkedin_url: string
  middleName: string
  name: string
  occupation: string
  parliamentarian: MappedParliamentarian
  published: string
  publishedIso: string
  twitter_name: string
  twitter_url: string
  updated: string
  updatedIso: string
  website: string
  wikidata_url: string
  wikipedia_url: string
}

export type RawLobbyGroup = {
  beschreibung: string
  branche: string
  branche_id: string
  freigabe_datum_unix: number
  id: string
  kommission1_abkuerzung: string
  kommission1_id: string
  kommission1_name: string
  kommission2_abkuerzung: string
  kommission2_id: string
  kommission2_name: string
  name: string
  organisationen: Array<RawOrganisation>
  parlamentarier: Array<RawParliamentarian>
  updated_date_unix: number
  wikidata_item_url: string
  wikipedia: string
  zwischen_organisationen?: Array<RawOrganisation>
  zutrittsberechtigte: Array<RawGuest>
  connections: Array<RawConnection>
}

export type RawConnection = {
  art: string
  beschreibung: string
  id: string
  interessengruppe: string
  organisation_id: string
  organisation_name: string
  parlamentarier: Array<RawParliamentarian>
  parlamentarier_name: string
  parlamentarier_id: string
  rechtsform: string
  verguetung: number
  verguetung_beschreibung: string
  verguetung_jahr: number
  verguetungen_pro_jahr: Array<RawVerguetung>
  wirksamkeit_index: number
  ziel_organisation_id: string
  ziel_organisation_name: string
  connector_organisation_id: string
  zwischen_organisation_id: string
  zwischen_organisation_art: string
  person_id: string
  zutrittsberechtigter: string
}

type MappedEdge = {
  __typename: string
  id: string
  name: string
}

export type MappedConnection = {
  description?: string
  from: MappedEdge & Record<string, unknown>
  function?: string
  group?: string
  potency?: unknown
  to: MappedEdge
  vias?: Array<unknown>
  compensations?: Array<MappedVerguetung>
  compensation?: MappedVerguetung | null
}

export type RawVerguetung = {
  beschreibung: string
  jahr: number
  verguetung: number
}
export type MappedVerguetung = {
  description: string | null
  money: number | null
  year: number
}

export type MappedLobbyGroup = {
  __typename: 'LobbyGroup'
  branch: {
    id: string
    name: string
    __typename: 'Branch'
  }
  commissions: Array<{
    id: string
    name: string
    abbr: string
  }>
  connections?: Array<MappedConnection>
  description: string
  id: string
  name: string
  published: string
  publishedIso: string
  sector: string
  updated: string
  updatedIso: string
  wikidata_url: string
  wikipedia_url: string
}

export type RawBranch = {
  beschreibung: string
  freigabe_datum_unix: number
  id: string
  interessengruppe: Array<{
    beschreibung: string
    id: string
    name: string
  }>
  kommission1_abkuerzung: string
  kommission1_id: string
  kommission1_name: string
  kommission2_abkuerzung: string
  kommission2_id: string
  kommission2_name: string
  kommission_id: string
  name: string
  updated_date_unix: number
  wikidata_item_url: string
  wikipedia: string
  parlamentarier: Array<RawParliamentarian>
  organisationen: Array<RawOrganisation>
  zwischen_organisationen?: Array<RawOrganisation>
  zutrittsberechtigte: Array<RawGuest>
  connections: Array<RawConnection>
}

export type MappedBranch = {
  __typename: 'Branch'
  commissions: Array<{
    id: string
    name: string
    abbr: string
  }>
  connections?: Array<MappedConnection>
  description: string
  id: string
  name: string
  published: string
  publishedIso: string
  updated: string
  updatedIso: string
  wikidata_url: string
  wikipedia_url: string
}

export type RawOrganisation = {
  abkuerzung: string
  adresse_plz: string
  beschreibung: string
  beziehungen: Array<RawConnection>
  freigabe_datum_unix: number
  homepage: string
  id: string
  interessengruppe: string
  interessengruppe1: string
  interessengruppe2: string
  interessengruppe2_id: string
  interessengruppe3: string
  interessengruppe3_id: string
  interessengruppe_id: string
  land_iso2: string
  name: string
  ort: string
  parlamentarier: Array<RawParliamentarian>
  rechtsform: 'Parlamentarische Gruppe' | 'Parlamentarische Freundschaftsgruppe'
  twitter_name: string
  twitter_url: string
  uid: string
  updated_date_unix: number
  wikidata_item_url: string
  wikipedia: string
  zutrittsberechtigte: Array<RawGuest>
}

export type MappedOrganisation = {
  __typename: 'Organisation'
  abbr: string
  connections?: Array<MappedConnection>
  countryIso2: string
  description: string
  id: string
  legalForm: string
  legalFormId: string
  lobbyGroups: Array<Partial<MappedLobbyGroup>>
  location: string
  name: string
  postalCode: string
  published: string
  publishedIso: string
  twitter_name: string
  twitter_url: string
  uid: string
  updated: string
  updatedIso: string
  website: string
  wikidata_url: string
  wikipedia_url: string
}

export type Locale = Schema.Schema.Type<typeof Locale>
export const Locale = Schema.Literal('de', 'fr')

export type LobbyGroupId = Schema.Schema.Type<typeof LobbyGroupId>
export const LobbyGroupId = Schema.String.pipe(Schema.brand('LobbyGroupId'))
