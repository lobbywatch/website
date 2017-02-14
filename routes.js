const nextRoutes = require('next-routes')
const NextLink = require('next/prefetch').default
const routes = module.exports = nextRoutes({
  WrapLink: NextLink
})
const {locales} = require('./constants')

const localeSegment = `:locale(${locales.join('|')})`
module.exports.localeSegment = localeSegment

routes.add('index', `/${localeSegment}`)
routes.add('blog', `/${localeSegment}/blog`)
routes.add('parliamentarians', `/${localeSegment}/daten/parlamentarier`)
routes.add('parliamentarian', `/${localeSegment}/daten/parlamentarier/:id/:name`)
routes.add('lobbygroups', `/${localeSegment}/daten/lobbygruppe`)
routes.add('lobbygroup', `/${localeSegment}/daten/lobbygruppe/:id/:name`)
routes.add('organisation', `/${localeSegment}/daten/organisation/:id/:name`)
routes.add('guest', `/${localeSegment}/daten/zutrittsberechtigter/:id/:name`)
routes.add('guests', `/${localeSegment}/daten/zutrittsberechtigter`)
routes.add('search', `/${localeSegment}/search`)
routes.add('page', `/${localeSegment}/:path*`)

module.exports.pathToRoute = (locale, path) => {
  const segments = path
    .replace(new RegExp(`^/${locale}`), '')
    .split('/')
    .filter(Boolean)

  if (segments.length) {
    return {
      route: 'page',
      params: {
        locale,
        path: segments
      }
    }
  } else {
    return {
      route: 'index',
      params: {
        locale
      }
    }
  }
}
