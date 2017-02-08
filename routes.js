const nextRoutes = require('next-routes')
const NextLink = require('next/prefetch').default
const routes = module.exports = nextRoutes({
  WrapLink: NextLink
})
const {locales} = require('./constants')

const localeSegment = `:locale(${locales.join('|')})`

routes.add('index', `/${localeSegment}`)
routes.add('parliamentarians', `/${localeSegment}/daten/parlamentarier`)
routes.add('parliamentarian', `/${localeSegment}/daten/parlamentarier/:id/:name`)
routes.add('lobbygroups', `/${localeSegment}/daten/lobbygruppe`)
routes.add('lobbygroup', `/${localeSegment}/daten/lobbygruppe/:id/:name`)
routes.add('parliamentarian', `/${localeSegment}/daten/parlamentarier/:id/:name`)
routes.add('organisation', `/${localeSegment}/daten/organisation/:id/:name`)
routes.add('page', `/${localeSegment}/:path*`)
