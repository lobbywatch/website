import { nest } from 'd3-collection'
import { HierarchyNode, stratify } from 'd3-hierarchy'
import { ascending, descending, sum } from 'd3-array'
import {
  MappedConnection,
  MappedGuest,
  MappedObjectType,
} from '../../../lib/types'
import { Formatter } from '../../../lib/translate'
import { ReactNode } from 'react'
import {
  LayoutDatum,
  LayoutDatumConnection,
  LayoutDatumGroup,
  LayoutDatumGuest,
  LayoutNode,
} from './layout'

export type NestConnectionType = 'Root' | 'Group' | 'Connection' | 'Guest'

const groupConnections = (
  connections: Array<MappedConnection>,
  directness: number,
) => {
  const groups = nest<MappedConnection, MappedConnection>()
    .key((connection) => connection.to.id)
    .entries(connections)

  return groups.map(({ values }: { values: Array<MappedConnection> }) => {
    let paths = values.map((value) => value.vias ?? [])
    paths.sort((a, b) => ascending(a.length, b.length))
    const indirect = paths.length > 0 && paths[0].length > directness

    return {
      ...values[0],
      // don't show empty direct connection in tooltip
      paths: paths.filter((p) => p.length),
      indirect,
    }
  })
}

export type HoverItem = LayoutNode

export type HoverValue = [
  key: string | null,
  test: (hover: HoverItem, props: NestConnectionsProps) => boolean,
  render?: (hover: HoverItem, props: NestConnectionsProps) => ReactNode,
]

export interface NestConnectionsProps {
  data: Array<MappedConnection>
  t: Formatter
  origin: MappedObjectType
  connectionWeight: (c: MappedConnection) => number
  directness?: number
  groupByDestination?: boolean
  hoverValues?: Array<HoverValue>
  intermediate?: (a: MappedConnection) => string
  intermediates?: Array<MappedGuest>
  maxGroups?: number
  potency?: boolean
}

const nestConnections = ({
  data,
  groupByDestination,
  directness = 0,
  intermediate = () => '',
  intermediates = [],
  maxGroups,
  connectionWeight,
  t,
}: NestConnectionsProps): HierarchyNode<LayoutDatum> => {
  let connectionData: Array<MappedConnection>
  connectionData = groupByDestination
    ? groupConnections(data, directness)
    : data

  const moreKey = t('connections/more/plural')
  const groupTree: Array<{
    key: string
    values: Array<{
      key: string
      values: Array<MappedConnection>
    }>
  }> = nest<MappedConnection>()
    .key(intermediate)
    .key((connection) => (connection.group ? connection.group : moreKey))
    .entries(connectionData)
  const nodeData: Array<LayoutDatum> = groupTree.reduce(
    (rootAccumulator, viaLevel) => {
      viaLevel.values
        .sort((a, b) => ascending(a.key, b.key))
        .sort((a, b) =>
          descending(
            sum(a.values.map(connectionWeight)),
            sum(b.values.map(connectionWeight)),
          ),
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
          moreGroups.reduce(
            (rest, { values }) => rest.concat(values),
            new Array<MappedConnection>(),
          ),
        )
        more.values.sort((a, b) =>
          descending(connectionWeight(a), connectionWeight(b)),
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
              type: 'Group' as const,
              potency: values.map((v) => v.potency)[0] ?? 'LOW',
              count: values.length,
              label: group,
            } satisfies LayoutDatumGroup)
            .concat(
              values.map(
                (connection: MappedConnection, index: number) =>
                  ({
                    id: `Connection-${groupId}-${index}`,
                    parentId: `Group-${groupId}`,
                    type: 'Connection' as const,
                    label: connection.to.name,
                    connection,
                  }) satisfies LayoutDatumConnection,
              ),
            )
        },
        new Array<LayoutDatum>(),
      )

      return viaLevel.key
        ? rootAccumulator.concat(viaNodes) // after via
        : viaNodes.concat(rootAccumulator) // before via
    },
    intermediates.map(
      (via) =>
        ({
          id: via.id,
          parentId: 'Root',
          type: 'Guest' as const,
          label: via.name,
        }) satisfies LayoutDatumGuest,
    ) as Array<LayoutDatum>,
  )
  nodeData.unshift({
    id: 'Root',
    type: 'Root' as const,
  })

  return stratify<LayoutDatum>()(nodeData)
}

export default nestConnections
