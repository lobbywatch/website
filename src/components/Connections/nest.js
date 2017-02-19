import {nest} from 'd3-collection'
import {stratify} from 'd3-hierarchy'
import {descending, ascending} from 'd3-array'

const groupConnections = (connections, directness) => {
  const groups = nest()
    .key(connection => connection.to.id)
    .entries(connections)

  return groups.map(({values}) => {
    let paths = values
      .map(value => value.vias.length && value.vias)
      .filter(Boolean)
    paths.sort((a, b) => ascending(a.length, b.length))
    if (!paths.length) {
      paths = undefined
    }
    return {
      ...values[0],
      paths,
      indirect: paths && paths[0].length > directness
    }
  })
}

export default ({
  data, groupByDestination, directness,
  intermediate, intermediates,
  maxGroups, connectionWeight,
  t
}) => {
  let connectionData
  if (groupByDestination) {
    connectionData = groupConnections(data, directness)
  } else {
    connectionData = data
  }

  const moreKey = t('connections/more/plural')
  const groupTree = nest()
    .key(intermediate)
    .key(connection => connection.group ? connection.group : moreKey)
    .entries(connectionData)

  const nodeData = groupTree.reduce(
    (rootAccumulator, viaLevel) => {
      viaLevel.values.sort((a, b) => descending(a.values.map(connectionWeight), b.values.map(connectionWeight)))

      const more = viaLevel.values.find(group => group.key === moreKey) || {
        key: moreKey,
        values: []
      }
      const groups = viaLevel.values.filter(group => group.key !== moreKey)
      const moreGroups = maxGroups ? groups.slice(maxGroups) : []
      let visibleGroups = groups.slice(0, maxGroups)
      if (moreGroups.length) {
        more.values = more.values.concat(moreGroups.reduce(
          (rest, {values}) => rest.concat(values),
          []
        ))
      }
      if (more.values.length) {
        visibleGroups.push(more)
      }

      const viaNodes = visibleGroups.reduce(
        (accumulator, {key: group, values}) => {
          const groupId = [viaLevel.key, group].filter(Boolean).join('-')
          return accumulator.concat({
            id: `Group-${groupId}`,
            parentId: viaLevel.key || 'Root',
            type: 'Group',
            count: values.length,
            label: group
          }).concat(values.map((connection, i) => ({
            id: `Connection-${groupId}-${i}`,
            parentId: `Group-${groupId}`,
            type: 'Connection',
            label: connection.to.name,
            connection
          })))
        },
        []
      )

      return viaLevel.key
        ? rootAccumulator.concat(viaNodes) // after via
        : viaNodes.concat(rootAccumulator) // before via
    },
    intermediates.map(via => ({
      id: via.id,
      parentId: 'Root',
      type: 'Guest',
      label: via.name
    }))
  )
  nodeData.unshift({
    id: 'Root',
    type: 'Root'
  })

  const hierarchy = stratify()(nodeData)
  return hierarchy
}
