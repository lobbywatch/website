const express = require('express')
const next = require('next')
const acceptLanguage = require('accept-language')

const graphql = require('./graphql')
const {locales, EXPRESS_PORT} = require('./constants')
const routes = require('./routes')

const DEV = process.env.NODE_ENV !== 'production'

const app = next({dir: '.', dev: DEV})
const handler = routes.getRequestHandler(app)

acceptLanguage.languages(locales)

app.prepare().then(() => {
  const server = express()

  graphql(server)

  server.get('/', (req, res) => {
    res.redirect(`/${acceptLanguage.get(req.headers['accept-language'])}`)
  })
  server.get(`/${routes.localeSegment}/search/daten/:term?`, (req, res) => {
    const {locale, term} = req.params
    res.redirect(301, `/${encodeURIComponent(locale)}/search${term ? `?term=${encodeURIComponent(term)}` : ''}`)
  })
  server.get(`/${routes.localeSegment}/artikel/archiv`, (req, res) => {
    const {locale} = req.params
    res.redirect(301, `/${encodeURIComponent(locale)}/blog`)
  })
  server.use(handler)

  server.listen(EXPRESS_PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${EXPRESS_PORT}`)
  })
})
