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
  firstName: String!
  middleName: String
  lastName: String!
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

type Parliamentarian implements Person {
  id: Int!
  firstName: String!
  middleName: String
  lastName: String!
  occupation: String
  gender: Gender
  # Format: YYYY-MM-DD
  dateOfBirth: String
  partyMembership: PartyMembership
}
`

const queryDefinitions = `
type RootQuery {
  meta(locale: Locale!): Meta
  page(path: String!): Page
  articles(locale: Locale!, limit: Int = 3, page: Int = 0): [Article]
  parliamentarians(locale: Locale!): [Parliamentarian]
  getParliamentarian(locale: Locale!, id: Int!): Parliamentarian
  translations(locale: Locale!): [Translation]
}

schema {
  query: RootQuery
}
`

module.exports = [genericTypes, cmsTypes, lwTypes, queryDefinitions]
