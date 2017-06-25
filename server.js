const express = require('express')
const next = require('next')
const acceptLanguage = require('accept-language')

const graphql = require('./graphql')
const {
  locales,
  EXPRESS_PORT,
  PUBLIC_BASE_URL,
  COUNTDOWN_DATE,
  GOOGLE_SITE_VERIFICATION
} = require('./constants')
const routes = require('./routes')

const DEV = process.env.NODE_ENV !== 'production'

const app = next({dir: '.', dev: DEV})
const handler = routes.getRequestHandler(app)

acceptLanguage.languages(locales)

app.prepare().then(() => {
  const server = express()

  if (PUBLIC_BASE_URL) {
    server.enable('trust proxy')
    server.use((req, res, next) => {
      if (`${req.protocol}://${req.get('Host')}` !== PUBLIC_BASE_URL) {
        return res.redirect(PUBLIC_BASE_URL + req.url)
      }
      return next()
    })
  }

  // only attach middle-ware if we're not already past it
  if ((new Date()) < COUNTDOWN_DATE) {
    const ALLOWED_PATHS = [
      '/_next',
      '/_webpack/',
      '/__webpack_hmr',
      '/static/',
      '/graphql',
      '/graphiql'
    ]

    server.use((req, res, next) => {
      const now = new Date()
      if (now < COUNTDOWN_DATE) {
        const BACKDOOR_URL = process.env.BACKDOOR_URL || ''
        if (req.url === BACKDOOR_URL) {
          res.cookie('backdoorUrl', BACKDOOR_URL, {
            maxAge: 2880000,
            httpOnly: true
          })
          return res.redirect('/')
        }

        const cookies = (
          req.headers.cookie &&
          require('cookie').parse(req.headers.cookie)
        ) || {}
        if (
          cookies['backdoorUrl'] === BACKDOOR_URL ||
          ALLOWED_PATHS.some(path => req.url.startsWith(path))
        ) {
          return next()
        }

        res.statusCode = 503
        return app.render(req, res, '/countdown', {})
      }
      return next()
    })
  }

  graphql(server)

  server.get('/', (req, res) => {
    res.redirect(`/${acceptLanguage.get(req.headers['accept-language'])}`)
  })
  server.get(`/${routes.localeSegment}/search/daten/:term?`, (req, res) => {
    const {locale, term} = req.params
    res.redirect(301, `/${encodeURIComponent(locale)}/search${term ? `?term=${encodeURIComponent(term)}` : ''}`)
  })
  server.get(`/${GOOGLE_SITE_VERIFICATION}`, (req, res) => {
    res.send(`google-site-verification: ${GOOGLE_SITE_VERIFICATION}`)
  })
  server.use(handler)

  server.listen(EXPRESS_PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on port ${EXPRESS_PORT}`)
  })
})
