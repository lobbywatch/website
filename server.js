const throng = require('throng')

const DEV = process.env.NODE_ENV !== 'production'
if (DEV || process.env.DOTENV) {
  require('dotenv').config()
}
const WEB_CONCURRENCY = process.env.WEB_CONCURRENCY || 1

const start = (workerId) => {
  const express = require('express')
  const next = require('next')
  const acceptLanguage = require('accept-language')
  const graphql = require('./graphql')
  const {
    locales,
    localeSegment,
    EXPRESS_PORT,
    GOOGLE_SITE_VERIFICATION,
    PUBLIC_BASE_URL
  } = require('./constants')

  const app = next({dir: '.', dev: DEV})
  const handler = app.getRequestHandler()

  acceptLanguage.languages(locales)

  app.prepare().then(() => {
    const server = express()

    graphql(server)

    if (!DEV && PUBLIC_BASE_URL) {
      server.enable('trust proxy')
      server.use((req, res, next) => {
        if (`${req.protocol}://${req.get('Host')}` !== PUBLIC_BASE_URL) {
          return res.redirect(PUBLIC_BASE_URL + req.url)
        }
        return next()
      })
    }

    server.get('/', (req, res) => {
      res.redirect(`/${acceptLanguage.get(req.headers['accept-language'])}`)
    })
    server.get(`/${localeSegment}/search/daten/:term?`, (req, res) => {
      const {locale, term} = req.params
      res.redirect(301, `/${encodeURIComponent(locale)}/search${term ? `?term=${encodeURIComponent(term)}` : ''}`)
    })
    server.get(`/${GOOGLE_SITE_VERIFICATION}`, (req, res) => {
      res.send(`google-site-verification: ${GOOGLE_SITE_VERIFICATION}`)
    })
    server.use(handler)

    server.listen(EXPRESS_PORT, (err) => {
      if (err) throw err
      console.log(`[${workerId}] Listening on ${EXPRESS_PORT}`)
    })
  })
}

throng({
  workers: WEB_CONCURRENCY,
  lifetime: Infinity
}, start)
