import { nest } from 'd3-collection'
import { stratify } from 'd3-hierarchy'
import { descending, ascending, sum } from 'd3-array'

const groupConnections = (connections, directness) => {
  const groups = nest()
    .key((connection) => connection.to.id)
    .entries(connections)

  return groups.map(({ values }) => {
    let paths = values.map((value) => value.vias)
    paths.sort((a, b) => ascending(a.length, b.length))
    if (paths.length === 0) {
      paths = undefined
    }
    const indirect = paths && paths[0].length > directness

    return {
      ...values[0],
      // don't show empty direct connection in tooltip
      paths: paths.filter((p) => p.length),
      indirect,
    }
  })
}

const nestConnections = ({
  data,
  groupByDestination,
  directness,
  intermediate,
  intermediates,
  maxGroups,
  connectionWeight,
  t,
}) => {
  let connectionData
  connectionData = groupByDestination
    ? groupConnections(data, directness)
    : data

  const moreKey = t('connections/more/plural')
  const groupTree = nest()
    .key(intermediate)
    .key((connection) => (connection.group ? connection.group : moreKey))
    .entries(connectionData)

  const nodeData = groupTree.reduce(
    (rootAccumulator, viaLevel) => {
      viaLevel.values
        .sort((a, b) => ascending(a.key, b.key))
        .sort((a, b) =>
          descending(
            sum(a.values.map(connectionWeight)),
            sum(b.values.map(connectionWeight))
          )
        )

      const more = viaLevel.values.find((group) => group.key === moreKey) || {
        key: moreKey,
        values: [],
      }
      const groups = viaLevel.values.filter((group) => group.key !== moreKey)
      const moreGroups = maxGroups ? groups.slice(maxGroups) : []
      const visibleGroups = groups.slice(0, maxGroups)
      if (moreGroups.length > 0) {
        more.values = more.values.concat(
          moreGroups.reduce((rest, { values }) => rest.concat(values), [])
        )
        more.values.sort((a, b) =>
          descending(connectionWeight(a), connectionWeight(b))
        )
      }
      if (more.values.length > 0) {
        visibleGroups.push(more)
      }

      const viaNodes = visibleGroups.reduce(
        (accumulator, { key: group, values }) => {
          const groupId = [viaLevel.key, group].filter(Boolean).join('-')
          return accumulator
            .concat({
              id: `Group-${groupId}`,
              parentId: viaLevel.key || 'Root',
              type: 'Group',
              potency: values.map((v) => v.potency)[0],
              count: values.length,
              label: group,
            })
            .concat(
              values.map((connection, index) => ({
                id: `Connection-${groupId}-${index}`,
                parentId: `Group-${groupId}`,
                type: 'Connection',
                label: connection.to.name,
                connection,
              }))
            )
        },
        []
      )

      return viaLevel.key
        ? rootAccumulator.concat(viaNodes) // after via
        : viaNodes.concat(rootAccumulator) // before via
    },
    intermediates.map((via) => ({
      id: via.id,
      parentId: 'Root',
      type: 'Guest',
      label: via.name,
    }))
  )
  nodeData.unshift({
    id: 'Root',
    type: 'Root',
  })

  return stratify()(nodeData)
}

export default nestConnections
