import { Schema } from 'effect'

export * from '../api/mappers/raw'

export type Locale = Schema.Schema.Type<typeof Locale>
export const Locale = Schema.Literal('de', 'fr')

export type BranchId = Schema.Schema.Type<typeof BranchId>
export const BranchId = Schema.String.pipe(Schema.brand('BranchId'))

export type GuestId = Schema.Schema.Type<typeof GuestId>
export const GuestId = Schema.String.pipe(Schema.brand('GuestId'))

export type LobbyGroupId = Schema.Schema.Type<typeof LobbyGroupId>
export const LobbyGroupId = Schema.String.pipe(Schema.brand('LobbyGroupId'))

export type OrganisationId = Schema.Schema.Type<typeof OrganisationId>
export const OrganisationId = Schema.String.pipe(Schema.brand('OrganisationId'))

export type ParliamentarianId = Schema.Schema.Type<typeof ParliamentarianId>
export const ParliamentarianId = Schema.String.pipe(
  Schema.brand('ParliamentarianId'),
)

export type MappedObject =
  | MappedParliamentarian
  | MappedGuest
  | MappedLobbyGroup
  | MappedBranch
  | MappedOrganisation

export type MappedObjectType = MappedObject['__typename']

type MappedPerson = {
  facebook_name?: string
  facebook_url?: string
  firstName: string
  gender: string
  lastName: string
  linkedin_url?: string
  middleName?: string
  name: string
  occupation: string
  twitter_name?: string
  twitter_url?: string
  website?: string
  wikidata_url?: string
  wikipedia_url?: string
}

export type MappedParliamentarian = MappedPerson & {
  __typename: 'Parliamentarian'
  active: boolean
  readonly age: number
  canton?: string
  children: number | null
  readonly civilStatus: string
  commissions: Array<{
    id: string
    name: string
    abbr: string
  }>
  compensationTransparence?: {
    dueDate?: string
    isTansparent: string // compensationTransparenceStateMap
  }
  connections?: Array<MappedConnection>
  council?: string
  councilExitDate?: string
  councilJoinDate?: string
  readonly councilTenure?: number
  readonly councilTitle: string
  dateOfBirth: string
  guests: Array<MappedGuest>
  id: string
  kommissionen_abkuerzung: string
  kommissionen_namen: string
  parlament_biografie_url: string
  parliamentId: string
  partyMembership?: {
    function: string
    party: {
      name?: string
      wikipedia_url?: string
      wikidata_url?: string
      abbr?: string
      twitter_name?: string
      twitter_url?: string
    }
  }
  portrait: string
  published?: string
  publishedIso?: string
  represents?: number
  updated?: string
  updatedIso?: string
}

export type MappedGuest = {
  __typename: 'Guest'
  connections?: Array<MappedConnection>
  dateOfBirth?: string
  facebook_name?: string
  facebook_url?: string
  firstName: string
  function: string
  gender?: string
  id: string
  lastName: string
  linkedin_url?: string
  middleName?: string
  name: string
  occupation?: string
  parliamentarian: MappedParliamentarian
  published: string
  publishedIso: string
  twitter_name?: string
  twitter_url?: string
  updated: string
  updatedIso: string
  website?: string
  wikidata_url?: string
  wikipedia_url?: string
}

export interface MappedEdge {
  __typename: MappedObjectType
  id: string
  name?: string
}

export type Potency = 'HIGH' | 'MEDIUM' | 'LOW'

export type MappedConnection = {
  description?: string
  from: MappedEdge & Record<string, unknown>
  function?: string
  group?: string
  potency?: Potency
  to: MappedEdge
  paths?: Array<Array<MappedConnection>>
  vias?: Array<MappedConnection>
  compensations?: Array<MappedVerguetung>
  compensation?: MappedVerguetung | null
  indirect?: boolean
}

export type MappedVerguetung = {
  description?: string
  money?: number
  year?: number
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
  description?: string
  id: string
  name: string
  published: string
  publishedIso: string
  sector: string
  updated: string
  updatedIso: string
  wikidata_url?: string
  wikipedia_url?: string
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
  wikidata_url?: string
  wikipedia_url?: string
}

export type MappedOrganisationLobbyGroup = Pick<
  MappedLobbyGroup,
  'id' | '__typename' | 'name'
>

export type MappedOrganisation = {
  __typename: 'Organisation'
  abbr?: string
  connections?: Array<MappedConnection>
  countryIso2?: string
  description?: string
  id: string
  legalForm: string
  legalFormId: string
  lobbyGroups: Array<MappedOrganisationLobbyGroup>
  location?: string
  name: string
  postalCode?: string
  published?: string
  publishedIso?: string
  twitter_name?: string
  twitter_url?: string
  uid?: string
  updated?: string
  updatedIso?: string
  website?: string
  wikidata_url?: string
  wikipedia_url?: string
}
