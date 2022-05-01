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

export const shouldIgnoreClick = (event, ignoreTarget) => {
  // based on https://github.com/zeit/next.js/blob/82d56e063aad12ac8fee5b9d5ed24ccf725b1a5b/packages/next-server/lib/link.js#L59
  const anchor = [event.target, event.currentTarget].find(
    (node) => node.nodeName === 'A'
  )
  return (
    !!anchor &&
    !!(
      (!ignoreTarget && anchor.target && anchor.target !== '_self') ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      (event.nativeEvent && event.nativeEvent.which === 2)
    )
  )
}
