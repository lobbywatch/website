const typeDefinitions = `
enum Locale {
  de
  fr
}
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
  created: Int
  categories: [String]!
  tags: [String]!
  lobbyGroups: [String]!
}

type RootQuery {
  meta(locale: Locale!): Meta
  page(path: String!): Page
  articles(locale: Locale!, limit: Int = 3, page: Int = 0): [Article]
}

schema {
  query: RootQuery
}
`

module.exports = [typeDefinitions]
