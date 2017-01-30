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
  content: String
  # YYYY-MM-DD HH-MM
  created: String
  categories: [String!]!
  tags: [String!]!
  lobbyGroups: [String!]!
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
  # Format: YYYY-MM-DD
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
  # measured in yearly CHF
  money: Int
  description: String
  source: String
  sourceUrl: String
}

enum Potency {
  HIGH
  MEDIUM
  LOW
}

type Organisation {
  id: ID!
  name: String
}
type Guest implements Person {
  id: ID!
  name: String!
  firstName: String!
  middleName: String
  lastName: String!
  occupation: String
  gender: Gender
  # Format: YYYY-MM-DD
  dateOfBirth: String
}

union ConnectionEntity = Parliamentarian | Organisation | Guest

type Connection {
  from: ConnectionEntity!
  to: ConnectionEntity!
  via: ConnectionEntity
  compensation: Compensation
  sector: String
  group: String
  potency: Potency
}

type Parliamentarian implements Person {
  id: ID!
  name: String!
  parliamentId: ID!
  firstName: String!
  middleName: String
  lastName: String!
  occupation: String
  gender: Gender
  # Format: YYYY-MM-DD
  dateOfBirth: String
  age: Int
  portrait: String
  partyMembership: PartyMembership
  canton: String!
  active: Boolean!
  council: Council!
  # In number of months
  councilTenure: Int
  # Format: YYYY-MM-DD
  councilJoinDate: String!
  # Format: YYYY-MM-DD
  councilExitDate: String
  # Number of people
  represents: Int
  children: Int
  civilStatus: String
  website: String
  commissions: [Commission!]!
  connections: [Connection!]!
}
`

const queryDefinitions = `
type RootQuery {
  meta(locale: Locale!): Meta
  page(path: String!): Page
  articles(locale: Locale!, limit: Int = 3, page: Int = 0): [Article]
  parliamentarians(locale: Locale!): [Parliamentarian]
  getParliamentarian(locale: Locale!, id: ID!): Parliamentarian
  translations(locale: Locale!): [Translation]
}

schema {
  query: RootQuery
}
`

module.exports = [genericTypes, cmsTypes, lwTypes, queryDefinitions]
