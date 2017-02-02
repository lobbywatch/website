const express = require('express')

const graphql = require('./graphql')
const PORT = typeof process !== 'undefined' && process.env.PORT || 5000

const DEV = process.env.NODE_ENV !== 'production'

const server = express()

graphql(server)

server.listen(PORT, (err) => {
  if (err) throw err
  console.log(`> Ready on port ${PORT}`)
})
