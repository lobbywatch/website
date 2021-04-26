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
    loaders: createLoaders()
  }),
  formatError: (err) => {
    console.error('[graphql]', err)
    return err
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/graphql' })
