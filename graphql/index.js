const bodyParser = require('body-parser')
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express')
const {makeExecutableSchema} = require('graphql-tools')

const Schema = require('./schema')
const Resolvers = require('./resolvers')
const createLoaders = require('./loaders')

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers
})

module.exports = server => {
  server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(request => ({
      schema: executableSchema,
      context: {
        loaders: createLoaders()
      }
    }))
  )

  server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
}
