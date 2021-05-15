const getRawId = ({ id, __typename }, locale) =>
  id
    ?.split('-')
    .filter((part) => part !== __typename && part !== locale)
    .join('-')

export const typeSegments = {
  Parliamentarian: 'daten/parlamentarier',
  LobbyGroup: 'daten/lobbygruppe',
  Branch: 'daten/branche',
  Organisation: 'daten/organisation',
  Guest: 'daten/zutrittsberechtigter',
}

export const itemPath = (item, locale) => {
  const { __typename, name } = item
  const typeSegment = typeSegments[__typename]
  if (!typeSegment) {
    console.warn('[itemPath] Unkown type', __typename, item)
    return '/'
  }
  return `/${encodeURIComponent(locale)}/${typeSegment}/${encodeURIComponent(
    getRawId(item, locale)
  )}${name ? `/${encodeURIComponent(name)}` : ''}`
}
