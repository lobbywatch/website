const express = require('express')
const next = require('next')

const {
  SERVER_PORT,
  NEXT_PUBLIC_BASE_URL
} = require('./constants')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev && NEXT_PUBLIC_BASE_URL) {
    server.enable('trust proxy')
    server.use((req, res, next) => {
      if (`${req.protocol}://${req.get('Host')}` !== NEXT_PUBLIC_BASE_URL) {
        return res.redirect(NEXT_PUBLIC_BASE_URL + req.url)
      }
      return next()
    })
  }

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(SERVER_PORT, (err) => {
    if (err) throw err
    console.log(`> Listening on ${SERVER_PORT}`)
  })
})