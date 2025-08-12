const express = require('express')
const next = require('next')
const v8 = require('v8')

const { SERVER_PORT, PUBLIC_BASE_URL } = require('./constants')

const development = process.env.NODE_ENV !== 'production'
const app = next({ dev: development })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!development && PUBLIC_BASE_URL) {
    server.enable('trust proxy')
    server.use((request, res, next) => {
      if (
        // allow 127.0.0.1 for graphql queries during SSR
        request.hostname !== '127.0.0.1' &&
        `${request.protocol}://${request.get('Host')}` !== PUBLIC_BASE_URL
      ) {
        return res.redirect(PUBLIC_BASE_URL + request.url)
      }
      return next()
    })
  }

  server.all('*', (request, res) => {
    return handle(request, res)
  })

  server.listen(SERVER_PORT, (error) => {
    if (error) throw error
    console.log(`> Listening on ${SERVER_PORT}`)
    console.log(
      `> Heap Limit: ${Math.round(
        v8.getHeapStatistics().total_available_size / 1024 / 1024,
      )}mb`,
    )
    console.log(`> NODE_OPTIONS: ${process.env.NODE_OPTIONS}`)
  })
})
