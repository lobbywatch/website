const express = require('express')
const next = require('next')

const DEV = process.env.NODE_ENV !== 'production'
const PORT = 3000

const app = next({ dir: '.', dev: DEV })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get(/^\/(de|fr)\//, (req, res) => {
    app.render(req, res, '/page', {path: req.path})
  })
  server.get('*', (req, res) => handle(req, res))

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${PORT}`)
  })
})
