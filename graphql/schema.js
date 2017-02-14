const genericTypes = `
enum Locale {
  de
  fr
}

type Translation {
  key: String!,
  value: String
}
`

const cmsTypes = `
type MenuLink {
  title: String
  href: String
}
type Block {
  key: String
  title: String
  content: String
}
type Meta {
  blocks: [Block]
  links: [MenuLink]
}
type Page {
  statusCode: Int
  title: String
  content: String
}
type Article {
  url: String
  title: String
  image: String
  author: String
  content: String
  lead: String
  # DD.MM.YYYY HH:MM
  created: String
  categories: [String!]!
  tags: [String!]!
  lobbyGroups: [String!]!
}
type ArticleList {
  pages: Int!
  list: [Article!]!
}
`

const lwTypes = `
enum Gender {
  M
  F
}

interface Person {
  name: String!
  firstName: String
  middleName: String
  lastName: String
  occupation: String
  gender: Gender
  # Format: DD.MM.YYYY
  dateOfBirth: String
}

type Party {
  name: String!
  abbr: String!
}

type PartyMembership {
  party: Party!
  function: String
}

enum Council {
  NR
  SR
}

type Commission {
  id: ID!
  name: String!
  abbr: String!
}

type Compensation {
  year: Int
  # measured in yearly CHF
  money: Int
  description: String
}

enum Potency {
  HIGH
  MEDIUM
  LOW
}

type Organisation {
  id: ID!
  updated: String!
  published: String!
  name: String!
  legalForm: String
  location: String
  description: String
  group: String
  uid: String
  website: String
  connections: [Connection!]
}
type Guest implements Person {
  id: ID!
  updated: String!
  published: String!
  name: String!
  firstName: String!
  middleName: String
  lastName: String!
  occupation: String
  gender: Gender
  # Format: DD.MM.YYYY
  dateOfBirth: String
  connections: [Connection!]!
  function: String,
  parliamentarian: Parliamentarian!
}

type LobbyGroup {
  id: ID!
  updated: String!
  published: String!
  name: String!
  description: String
  sector: String
  commissions: [Commission!]!
  connections: [Connection]
}

union Entity = Parliamentarian | Organisation | Guest | LobbyGroup

type Connection {
  from: Entity!
  to: Entity!
  via: Entity
  compensation: Compensation
  group: String
  potency: Potency
  function: String
}

type Parliamentarian implements Person {
  id: ID!
  updated: String!
  published: String!
  name: String!
  parliamentId: ID!
  firstName: String!
  middleName: String
  lastName: String!
  occupation: String
  gender: Gender
  # Format: DD.MM.YYYY
  dateOfBirth: String
  age: Int
  portrait: String
  partyMembership: PartyMembership
  canton: String!
  active: Boolean!
  council: Council!
  councilTitle: String!
  # In number of months
  councilTenure: Int
  # Format: DD.MM.YYYY
  councilJoinDate: String!
  # Format: DD.MM.YYYY
  councilExitDate: String
  # Number of people
  represents: Int
  children: Int
  civilStatus: String
  website: String
  commissions: [Commission!]!
  connections: [Connection!]!
  guests: [Guest!]!
}
`

const queryDefinitions = `
type RootQuery {
  meta(locale: Locale!): Meta
  page(locale: Locale!, path: String!): Page
  articles(locale: Locale!, limit: Int = 2, page: Int = 0): ArticleList!
  parliamentarians(locale: Locale!): [Parliamentarian!]!
  getParliamentarian(locale: Locale!, id: ID!): Parliamentarian
  guests(locale: Locale!): [Guest!]!
  getGuest(locale: Locale!, id: ID!): Guest
  getOrganisation(locale: Locale!, id: ID!): Organisation
  lobbyGroups(locale: Locale!): [LobbyGroup!]!
  getLobbyGroup(locale: Locale!, id: ID!): LobbyGroup
  search(locale: Locale!, term: String!): [Entity!]!
  translations(locale: Locale!): [Translation!]!
}

schema {
  query: RootQuery
}
`

module.exports = [genericTypes, cmsTypes, lwTypes, queryDefinitions]
