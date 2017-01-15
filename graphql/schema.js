const typeDefinitions = `
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int!
  tags: [String]
  title: String
  text: String
  views: Int
  author: Author
}

type RootQuery {
  author(firstName: String, lastName: String): Author
}

schema {
  query: RootQuery
}
`

module.exports = [typeDefinitions]
