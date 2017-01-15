const express = require('express')
const next = require('next')
const acceptLanguage = require('accept-language')

const graphql = require('./graphql')
const {locales} = require('./src/constants')

const DEV = process.env.NODE_ENV !== 'production'
const PORT = 3000

const app = next({dir: '.', dev: DEV})
const handle = app.getRequestHandler()

const localeSegment = `:locale(${locales.join('|')})`
acceptLanguage.languages(locales)

app.prepare().then(() => {
  const server = express()

  graphql(server)

  server.get('/', (req, res) => {
    res.redirect(`/${acceptLanguage.get(req.headers['accept-language'])}`);
  })
  server.get(`/${localeSegment}`, (req, res) => {
    app.render(req, res, '/index', {locale: req.params.locale})
  })
  server.get(`/${localeSegment}/*`, (req, res) => {
    app.render(req, res, '/page', {path: req.path})
  })
  server.get('*', (req, res) => handle(req, res))

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${PORT}`)
  })
})
