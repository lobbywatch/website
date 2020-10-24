import routes from '../../routes'

export const getRawId = ({ id, __typename }, locale) => id
  .split('-')
  .filter(part => part !== __typename && part !== locale)
  .join('-')

export const matchRouteFromDatum = (datum, locale) => {
  const routeName = datum.__typename.toLowerCase()
  const route = routes.findByName(routeName)
  if (!route) {
    return null
  }

  const params = {
    locale,
    id: getRawId(datum, locale),
    name: datum.name
  }

  return {
    routeName,
    params,
    as: route.getAs(params)
  }
}
