import { Component } from 'react'

import styles from './index.module.css'

import GuestIcon from '../../assets/Guest'
import ContextBox, { ContextBoxValue } from '../ContextBox'
import Legend from './Legend'
import Message, { useT } from '../Message'
import { chfFormat } from '../../utils/formats'
import { itemPath, shouldIgnoreClick } from '../../utils/routes'
import { NextRouter, useRouter } from 'next/router'
import layout, { LayoutNode, START_Y } from './layout'
import nestConnections, {
  HoverItem,
  HoverValue,
  NestConnectionsProps,
} from './nest'
import { set, Set } from 'd3-collection'

import Icons from '../../assets/TypeIcons'
import { Locale, MappedConnection, Potency } from '../../../lib/types'
import { shallowEqual } from 'shallow-equal'
import { intersperse } from '../../utils/helpers'

const POTENCY_COLORS: Record<Potency, string> = {
  HIGH: 'var(--colorPotencyHigh)',
  MEDIUM: 'var(--colorPotencyMedium)',
  LOW: 'var(--colorPotencyLow)',
}

const POTENCY_COLORS_KEYS: Array<Potency> = ['LOW', 'MEDIUM', 'HIGH']

const styleBubble = ['u-plain-button', styles.bubble].join(' ')
const styleBubbleVia = ['u-plain-button', styles.bubble, styles.bubbleVia].join(
  ' ',
)

interface ConnectionsProps extends NestConnectionsProps {
  locale: Locale
  router: NextRouter
  updated?: string
  published?: string
}

export interface ConnectionsState {
  nodes: Array<LayoutNode>
  links: Array<LayoutNode & { source: LayoutNode; target: LayoutNode }>
  open: Set
  hover?: HoverItem | null
  width?: number
  hierarchy?: LayoutNode
  previousProps?: NestConnectionsProps
}

class Connections extends Component<ConnectionsProps, ConnectionsState> {
  state: ConnectionsState = {
    nodes: [],
    links: [],
    open: set(),
  }

  private containerRef?: null | HTMLDivElement
  private svgRef?: null | SVGSVGElement
  private hoverNode?: null | LayoutNode

  private measure = () => {
    const { nodes } = this.state

    const containerRect = this.containerRef?.getBoundingClientRect()

    for (const { data, ref } of nodes) {
      if (ref != null) {
        ref.style.removeProperty('position')
        ref.style.removeProperty('left')
        ref.style.removeProperty('top')
        const rect = ref.getBoundingClientRect()
        data.measurements = {
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
        }
      }
    }

    const width = containerRect?.width
    if (width !== this.state.width) {
      this.setState({ width })
    }
    this.layout()
  }

  static getDerivedStateFromProps(
    properties: NestConnectionsProps,
    state: ConnectionsState,
  ) {
    if (state.previousProps && shallowEqual(properties, state.previousProps)) {
      return null
    }
    const hierarchy = nestConnections(properties)
    const nodes = hierarchy.descendants() as unknown as Array<LayoutNode>
    for (const node of nodes) {
      node.setRef = (reference: HTMLElement | SVGElement | null) => {
        node.ref = reference
      }
    }
    const links = hierarchy.links() as unknown as Array<LayoutNode>
    for (const [, link] of links.entries()) {
      link.setRef = (reference: HTMLElement | SVGElement | null) => {
        link.ref = reference
      }
    }

    return {
      hover: null,
      width: undefined,
      nodes,
      links,
      hierarchy,
      open: set(),
      previousProps: properties,
    }
  }

  layout() {
    const height =
      this.state.hierarchy != null
        ? layout(this.state.hierarchy, this.state.width ?? 0, (id) =>
            this.state.open.has(id),
          )
        : 0

    const { nodes, links, open } = this.state
    const openSize = open.size()
    for (const { x, y, data, ref, parent, depth } of nodes) {
      if (ref != null) {
        ref.style.position = 'absolute'
        ref.style.left = `${x}px`
        ref.style.top = `${y}px`
        ref.style.margin = '0'
        if (openSize) {
          ref.style.opacity =
            open.has(data.id) ||
            (parent && open.has(parent.data.id) && depth > openSize)
              ? '1'
              : '0.2'
        } else {
          ref.style.opacity = '1'
        }
      }
    }

    for (const { ref, source, target } of links) {
      if (ref) {
        if (openSize) {
          ref.style.opacity =
            (source.depth === 0 || open.has(source.data.id)) &&
            (open.has(target.data.id) || target.depth > openSize)
              ? '1'
              : '0.2'
        } else {
          ref.style.opacity = '1'
        }

        const {
          x: sx,
          y: sy,
          data: { measurements: sMeasurements },
        } = source
        const scx = sx + sMeasurements.width / 2
        const sey = sy + sMeasurements.height
        const {
          x: tx,
          y: ty,
          data: { measurements: tMeasurements },
        } = target
        const tcx = tx + tMeasurements.width / 2

        ref.setAttribute(
          'd',
          'M' +
            scx +
            ',' +
            sey +
            'C' +
            scx +
            ',' +
            (sey + ty) / 2 +
            ' ' +
            tcx +
            ',' +
            (sey + ty) / 2 +
            ' ' +
            tcx +
            ',' +
            ty,
          // 'M' + scx + ',' + sey +
          // 'C' + (scx + tcx) / 2 + ',' + sey +
          // ' ' + (scx + tcx) / 2 + ',' + ty +
          // ' ' + tcx + ',' + ty
        )
      }
    }

    if (this.containerRef) this.containerRef.style.height = `${height}px`
    if (this.svgRef) this.svgRef.style.height = `${height}px`
  }

  componentDidMount() {
    window.addEventListener('resize', this.measure)
    this.measure()
  }

  componentDidUpdate() {
    if (!this.state.width) {
      this.measure()
    } else {
      this.layout()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measure)
  }

  render() {
    const { nodes, links, hover, open, width } = this.state
    const {
      locale,
      t,
      intermediates,
      potency,
      updated,
      published,
      hoverValues,
      router,
    } = this.props
    let viaI = 0

    const getVisible = (parent: LayoutNode | null) =>
      !parent || parent.data.id === 'Root' || open.has(parent.data.id)
    const hasIndirect = !!nodes.find(
      ({ data }) => data && 'connection' in data && data.connection.indirect,
    )

    return (
      <div className={styles.edge}>
        <div
          className='u-center-container'
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <div
            className={styles.container}
            ref={(reference) => {
              this.containerRef = reference
            }}
          >
            {!!hover && !!width && (
              <ContextBox
                x={hover.x + hover.data.measurements.width / 2}
                y={hover.y + hover.data.measurements.height + 12}
                contextWidth={width}
              >
                {hoverValues?.map(([key, test, render], index) => {
                  const hasValue = test(hover, this.props)
                  if (!hasValue) {
                    return null
                  }
                  const content = render ? render(hover, this.props) : hasValue
                  if (!key) {
                    return content
                  }
                  return (
                    <ContextBoxValue key={index} label={t(key)}>
                      {content}
                    </ContextBoxValue>
                  )
                })}
              </ContextBox>
            )}
            <svg
              width={width}
              ref={(reference) => {
                this.svgRef = reference
              }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {!!width &&
                links.map(({ source, target, setRef }, index) => {
                  const visible =
                    getVisible(source.parent) && getVisible(target.parent)
                  if (visible) {
                    return (
                      <path
                        key={index}
                        ref={setRef}
                        fill='none'
                        stroke={'var(--colorWhite)'}
                        strokeWidth={2}
                      />
                    )
                  }
                })}
            </svg>
            <div
              style={{
                textAlign: 'center',
                position: 'relative',
                paddingTop: START_Y,
              }}
            >
              {nodes.map((node) => {
                const { data, setRef, children, parent } = node
                const isVisible = getVisible(parent)
                const isOpen = open.has(data.id)
                const toggle = () => {
                  const isParentOpen =
                    parent != null && open.has(parent.data.id)
                  const nextOpen = isParentOpen ? set([parent.data.id]) : set()
                  if (!isOpen) {
                    nextOpen.add(data.id)
                  } else {
                    nextOpen.remove(data.id)
                  }
                  this.setState({ open: nextOpen })
                }
                if (data.type === 'Root') {
                  return (
                    <span className={styles.root} key={data.id} ref={setRef} />
                  )
                }
                if (data.type === 'Group') {
                  const indirect = data.parentId !== 'Root'
                  return (
                    <button
                      key={data.id}
                      ref={setRef}
                      className={[
                        indirect ? styleBubbleVia : styleBubble,
                        !isVisible && styles.hidden,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={toggle}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: !indirect
                          ? POTENCY_COLORS[data.potency]
                          : undefined,
                      }}
                    >
                      <span
                        className={
                          indirect
                            ? [styles.count, styles.countVia].join(' ')
                            : styles.count
                        }
                      >
                        {data.count}
                      </span>{' '}
                      {data.label}
                    </button>
                  )
                }
                if (data.type === 'Guest') {
                  const isFirst = viaI === 0
                  viaI += 1
                  const isLast = viaI === (intermediates?.length ?? 0)
                  return (
                    <span key={data.id}>
                      {!!isFirst && <br />}
                      <a
                        ref={setRef}
                        className={[
                          styleBubbleVia,
                          !isVisible ? styles.hidden : undefined,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        href={itemPath(
                          {
                            __typename: 'Guest',
                            id: data.id,
                            name: data.label,
                          },
                          locale,
                        )}
                        onClick={(e) => {
                          if (shouldIgnoreClick(e)) {
                            return
                          }
                          e.preventDefault()
                          toggle()
                        }}
                        style={{
                          cursor:
                            children && children.length > 0 ? 'pointer' : '',
                        }}
                      >
                        <GuestIcon className={styles.icon} /> {data.label}
                      </a>
                      {!!isLast && <br />}
                    </span>
                  )
                }
                if (data.type === 'Connection') {
                  const { connection } = data
                  const canHover =
                    !hoverValues ||
                    hoverValues
                      .map(([, test]) => test(node, this.props))
                      .filter(Boolean).length > 0

                  const detailPath = itemPath(connection.to, locale)

                  const onFocus = canHover
                    ? () => this.setState({ hover: node })
                    : undefined
                  const onBlur = canHover
                    ? () => {
                        this.setState({ hover: null })
                        if (this.hoverNode === node) {
                          this.hoverNode = undefined
                        }
                      }
                    : undefined

                  return (
                    <a
                      key={data.id}
                      ref={setRef}
                      href={detailPath}
                      onClick={(e) => {
                        if (shouldIgnoreClick(e)) {
                          return
                        }
                        e.preventDefault()

                        // ensure Android only navigates on second tap
                        // - matching iOS hover behaviour
                        if (!canHover || this.hoverNode !== node) {
                          router.push(detailPath)
                        }
                      }}
                      onTouchStart={() => {
                        this.hoverNode =
                          this.hoverNode === node ? undefined : node
                      }}
                      onFocus={onFocus}
                      onMouseOver={onFocus}
                      onBlur={onBlur}
                      onMouseOut={onBlur}
                      className={[
                        connection.indirect
                          ? [styles.connection, styles.connectionIndirect].join(
                              ' ',
                            )
                          : styles.connection,
                        !isVisible && styles.hidden,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{
                        backgroundColor:
                          POTENCY_COLORS[connection.potency ?? 'LOW'],
                      }}
                    >
                      {connection.to.name}
                    </a>
                  )
                }
              })}
            </div>
          </div>
          {!!(published || updated) && (
            <div className={[styles.metaBox, 'text-meta'].join(' ')}>
              {intersperse(
                [
                  !!published && (
                    <Message
                      key='published'
                      locale={locale}
                      id='published'
                      replacements={{ date: published }}
                    />
                  ),
                  !!updated && (
                    <Message
                      key='updated'
                      locale={locale}
                      id='updated'
                      replacements={{ date: updated }}
                    />
                  ),
                ],
                (_, i) => (
                  <br key={i} />
                ),
              )}
            </div>
          )}
        </div>
        {potency && (
          <Legend
            locale={locale}
            title={t('connections/legend/title')}
            pagePath={t('connections/legend/path').split('/')}
            items={POTENCY_COLORS_KEYS.map((key) => ({
              label: t(`connections/legend/${key}`),
              color: POTENCY_COLORS[key],
            }))}
          />
        )}
        {hasIndirect && (
          <Legend
            locale={locale}
            title={t('connections/legend/type/title')}
            items={[
              {
                color: 'var(--colorGreyDark)',
                textColor: 'var(--colorBlack)',
                label: t('connections/legend/direct'),
              },
              {
                color: 'var(--colorWhite)',
                label: t('connections/legend/indirect'),
                border: '1px solid var(--colorGreyDark)',
                textColor: 'var(--colorBlack)',
              },
            ]}
          />
        )}
      </div>
    )
  }
}

const hoverValues: Array<HoverValue> = [
  [
    'connections/context/occupation',
    ({ data }, { origin }) =>
      origin === 'LobbyGroup' &&
      'connection' in data &&
      data.connection.vias?.length === 0 &&
      data.connection.function != null,
  ],
  [
    'connections/context/paths/direct',
    ({ data }, { origin }) =>
      origin === 'Organisation' &&
      'connection' in data &&
      data.connection.function != null,
  ],
  [
    null,
    ({ data }) =>
      'connection' in data &&
      data.connection.paths != null &&
      data.connection.paths.length > 0,
    ({ data }, { t, directness = 0 }) =>
      'connection' in data &&
      data.connection.paths != null &&
      data.connection.paths.map((path, index) => (
        <ContextBoxValue
          key={`paths-${index}`}
          label={t(
            `connections/context/paths/${
              path.length > directness ? 'indirect' : 'direct'
            }`,
          )}
        >
          <span>
            {path
              .flat()
              .reverse()
              .map((via, ii) => {
                const Icon =
                  via.to.__typename != 'Parliamentarian'
                    ? Icons[via.to.__typename]
                    : undefined
                return (
                  <span key={ii} className={styles.pathSegment}>
                    {Icon && (
                      <Icon className={styles.pathSegmentIcon} size={16} />
                    )}
                    {via.to.name}
                    <br />
                    <span className={styles.pathSegmentFunction}>
                      {via.function}
                    </span>
                  </span>
                )
              })}
          </span>
        </ContextBoxValue>
      )),
  ],
  [
    'connections/context/function',
    ({ data }, { origin }) =>
      (origin === 'Parliamentarian' || origin === 'Guest') &&
      'connection' in data &&
      data.connection.function != null,
  ],
  [
    'connections/context/description',
    ({ data }) => 'connection' in data && data.connection.description != null,
  ],
  [
    'connections/context/compensation',
    ({ data }) =>
      'connection' in data &&
      !!data.connection.compensations &&
      data.connection.compensations.length > 0 &&
      (data.connection.from?.__typename === 'Parliamentarian' ||
        data.connection.to?.__typename === 'Parliamentarian') &&
      data.connection.vias?.length === 0,
    ({ data }, { t }) =>
      'connection' in data &&
      data.connection.compensations
        ?.filter((e, index) => index < 3)
        .map((compensation, index) => (
          <div key={`compensation-${index}`}>
            {compensation.year}
            {': '}
            {compensation.money != null
              ? t.pluralize('connections/context/compensation/money', {
                  count: compensation.money,
                  formatted: chfFormat(compensation.money),
                }) +
                (compensation.description
                  ? ` (${compensation.description})`
                  : '')
              : t('connections/context/compensation/notAvailable')}
          </div>
        )),
  ],
  [
    'connections/context/lobbygroup',
    ({ data, parent }, { origin }) =>
      (origin === 'Parliamentarian' || origin === 'Guest') &&
      'connection' in data &&
      (parent?.data == null ||
        !('label' in parent.data) ||
        data.connection.group !== parent?.data.label) &&
      data.connection.group != null,
  ],
]

const POTENCY_WEIGHT = {
  HIGH: 1000,
  MEDIUM: 50,
  LOW: 1,
}

const connectionWeight = (connection: MappedConnection) =>
  POTENCY_WEIGHT[connection.potency ?? 'HIGH']

interface NewConnectionsProps extends Omit<NestConnectionsProps, 't'> {
  locale: Locale
  data: Array<MappedConnection>
  published?: string
  updated?: string
}

function NewConnections(props: NewConnectionsProps) {
  const t = useT(props.locale)
  const router = useRouter()
  const defaultProps = {
    directness: 0,
    potency: false,
    intermediate: () => '',
    intermediates: [],
    groupByDestination: false,
    maxGroups: undefined,
    connectionWeight: connectionWeight,
    hoverValues,
  }
  return <Connections {...defaultProps} {...props} t={t} router={router} />
}

export default NewConnections
