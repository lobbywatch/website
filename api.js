const express = require('express')
const cors = require('cors')

const graphql = require('./graphql')
const PORT = typeof process !== 'undefined' && process.env.PORT || 5000

const server = express()

server.use(cors())
graphql(server)

server.listen(PORT, (err) => {
  if (err) throw err
  console.log(`> Ready on port ${PORT}`)
})
