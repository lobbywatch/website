import { ApolloServer } from 'apollo-server-micro'

const Schema = require('../../graphql/schema')
const Resolvers = require('../../graphql/resolvers')
const createLoaders = require('../../graphql/loaders')

const apolloServer = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
  introspection: true,
  playground: true,
  context: () => ({
    loaders: createLoaders(),
  }),
  formatError: (error) => {
    console.error('[graphql]', error)
    return error
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/graphql' })
