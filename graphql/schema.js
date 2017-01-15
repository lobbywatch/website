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
  title: String
  content: String
}

type RootQuery {
  meta(locale: Locale!): Meta
  page(path: String!): Page
}

schema {
  query: RootQuery
}
`

module.exports = [typeDefinitions]
