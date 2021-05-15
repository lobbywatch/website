const express = require('express')
const next = require('next')

const { SERVER_PORT, NEXT_PUBLIC_BASE_URL } = require('./constants')

const development = process.env.NODE_ENV !== 'production'
const app = next({ dev: development })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!development && NEXT_PUBLIC_BASE_URL) {
    server.enable('trust proxy')
    server.use((request, res, next) => {
      if (
        // allow 127.0.0.1 for graphql queries during SSR
        request.hostname !== '127.0.0.1' &&
        `${request.protocol}://${request.get('Host')}` !== NEXT_PUBLIC_BASE_URL
      ) {
        return res.redirect(NEXT_PUBLIC_BASE_URL + request.url)
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
  })
})
