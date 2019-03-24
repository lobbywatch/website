const { ApolloServer, gql } = require('apollo-server-express')
const playground = require('graphql-playground-middleware-express').default

const Schema = require('./schema')
const Resolvers = require('./resolvers')
const createLoaders = require('./loaders')

module.exports = app => {
  const apollo = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,
    context: () => ({
      loaders: createLoaders()
    })
  })

  apollo.applyMiddleware({ app })
  app.get('/graphiql', playground({ endpoint: '/graphql' }))
}
