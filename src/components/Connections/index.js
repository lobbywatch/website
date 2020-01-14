import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {WHITE, BLACK, GREY_DARK, POTENCY_COLORS} from '../../theme'
import GuestIcon from '../../assets/Guest'
import ContextBox, {ContextBoxValue} from '../ContextBox'
import {metaRule} from '../Styled'
import Legend from './Legend'
import Message, {withT} from '../Message'
import {shallowEqual, intersperse} from '../../utils/helpers'
import {chfFormat} from '../../utils/formats'
import routes, {Router as RoutesRouter} from '../../../routes'
import layout, {START_Y} from './layout'
import nest from './nest'
import {set} from 'd3-collection'
import * as style from './style'
import {Center} from '../Frame'

import Icons from '../../assets/TypeIcons'

class Connections extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      open: set()
    }

    this.measure = () => {
      const {nodes} = this.state

      const containerRect = this.containerRef.getBoundingClientRect()

      nodes.forEach(({data, ref}) => {
        ref.style.removeProperty('position')
        ref.style.removeProperty('left')
        ref.style.removeProperty('top')
        const rect = ref.getBoundingClientRect()
        data.measurements = {
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height)
        }
      })

      const width = containerRect.width
      if (width !== this.state.width) {
        this.setState({width})
      }
      this.layout()
    }
  }
  nestData (state, props) {
    const hierarchy = nest(props)
    const nodes = hierarchy.descendants()
    nodes.forEach(node => {
      node.setRef = ref => {
        node.ref = ref
      }
    })
    const links = hierarchy.links()
    links.forEach((link, i) => {
      link.setRef = ref => {
        link.ref = ref
      }
    })

    let nextState = {
      hover: null,
      width: undefined,
      nodes,
      links,
      hierarchy,
      open: set()
    }

    return nextState
  }
  layout () {
    const height = layout(this.state)

    const {nodes, links, open} = this.state
    const openSize = open.size()
    nodes.forEach(({x, y, data, ref, parent, depth}) => {
      ref.style.position = 'absolute'
      ref.style.left = `${x}px`
      ref.style.top = `${y}px`
      ref.style.margin = '0'
      if (openSize) {
        ref.style.opacity = (
          open.has(data.id) ||
          (parent && open.has(parent.data.id) && depth > openSize)
        ) ? 1 : 0.2
      } else {
        ref.style.opacity = 1
      }
    })

    links.forEach(({ref, source, target}) => {
      if (ref) {
        if (openSize) {
          ref.style.opacity = (
            (source.depth === 0 || open.has(source.data.id)) &&
            (open.has(target.data.id) || target.depth > openSize)
          ) ? 1 : 0.2
        } else {
          ref.style.opacity = 1
        }

        const {x: sx, y: sy, data: {measurements: sMeasurements}} = source
        const scx = sx + sMeasurements.width / 2
        const sey = sy + sMeasurements.height
        const {x: tx, y: ty, data: {measurements: tMeasurements}} = target
        const tcx = tx + tMeasurements.width / 2

        ref.setAttribute('d', (
          'M' + scx + ',' + sey +
          'C' + scx + ',' + (sey + ty) / 2 +
          ' ' + tcx + ',' + (sey + ty) / 2 +
          ' ' + tcx + ',' + ty
          // 'M' + scx + ',' + sey +
          // 'C' + (scx + tcx) / 2 + ',' + sey +
          // ' ' + (scx + tcx) / 2 + ',' + ty +
          // ' ' + tcx + ',' + ty
        ))
      }
    })

    this.containerRef.style.height = `${height}px`
    this.svgRef.style.height = `${height}px`
  }
  componentWillMount () {
    this.setState(this.nestData)
  }
  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(this.props, nextProps)) {
      this.setState(this.nestData(this.state, nextProps))
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    if (!this.state.width) {
      this.measure()
    } else {
      this.layout()
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
  }
  render () {
    const {
      nodes, links, hover, open,
      width
    } = this.state
    const {
      locale, t,
      intermediates,
      potency,
      updated, published,
      hoverValues
    } = this.props
    let viaI = 0

    const getVisible = parent => !parent || parent.data.id === 'Root' || open.has(parent.data.id)
    const hasIndirect = !!nodes.find(({data}) => data && data.connection && data.connection.indirect)

    return (
      <div {...style.edge}>
        <Center style={{paddingTop: 0, paddingBottom: 0}}>
          <div {...style.container} ref={ref => { this.containerRef = ref }}>
            {!!hover && !!width && <ContextBox x={hover.x + hover.data.measurements.width / 2} y={hover.y + hover.data.measurements.height + 12} contextWidth={width}>
              {hoverValues.map(([key, test, render], i) => {
                const hasValue = test(hover, this.props)
                if (!hasValue) {
                  return null
                }
                const content = render ? render(hover, this.props) : hasValue
                if (!key) {
                  return content
                }
                return (
                  <ContextBoxValue key={i} label={t(key)}>
                    {content}
                  </ContextBoxValue>
                )
              })}
            </ContextBox>}
            <div {...style.metaBox} {...metaRule}>
              {intersperse([
                !!published && <Message key='published' locale={locale} id='published' replacements={{date: published}} />,
                !!updated && <Message key='updated' locale={locale} id='updated' replacements={{date: updated}} />
              ], <br key='br' />)}
            </div>
            <svg width={width} ref={ref => { this.svgRef = ref }} style={{position: 'absolute', top: 0, left: 0}}>
              {!!width && links.map(({source, target, setRef}, i) => {
                const visible = getVisible(source.parent) && getVisible(target.parent)
                if (visible) {
                  return <path key={i} ref={setRef}
                    fill='none' stroke={WHITE} strokeWidth={2} />
                }
              })}
            </svg>
            <div style={{textAlign: 'center', position: 'relative', paddingTop: START_Y}}>
              {nodes.map((node) => {
                const {data, setRef, children, parent} = node
                const isVisible = getVisible(parent)
                const isOpen = open.has(data.id)
                const toggle = () => {
                  const isParentOpen = open.has(parent.data.id)
                  let nextOpen = isParentOpen ? set([parent.data.id]) : set()
                  if (!isOpen) {
                    nextOpen.add(data.id)
                  } else {
                    nextOpen.remove(data.id)
                  }
                  this.setState({open: nextOpen})
                }
                if (data.type === 'Root') {
                  return <span key={data.id} ref={setRef} {...style.root} />
                }
                if (data.type === 'Group') {
                  const indirect = data.parentId !== 'Root'
                  return (
                    <span key={data.id} ref={setRef}
                      className={[
                        (indirect ? style.bubbleVia : style.bubble),
                        !isVisible && style.hidden
                      ].filter(Boolean).join(' ')}
                      onClick={toggle}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: !indirect
                          ? POTENCY_COLORS[data.potency]
                          : undefined
                      }}>
                      <span className={indirect ? style.countVia : style.count}>{data.count}</span> {data.label}
                    </span>
                  )
                }
                if (data.type === 'Guest') {
                  let isFirst = viaI === 0
                  viaI += 1
                  let isLast = viaI === intermediates.length
                  return (<span key={data.id}>
                    {!!isFirst && <br />}
                    <span ref={setRef}
                      {...style.bubbleVia}
                      className={!isVisible ? style.hidden : undefined}
                      onClick={toggle}
                      style={{cursor: children && children.length ? 'pointer' : ''}}>
                      <GuestIcon className={style.icon} /> {data.label}
                    </span>
                    {!!isLast && <br />}
                  </span>)
                }
                if (data.type === 'Connection') {
                  const {connection} = data
                  const canHover = !!hoverValues
                    .map(([_, test]) => test(node, this.props))
                    .filter(Boolean)
                    .length

                  const routeName = connection.to.__typename.toLowerCase()
                  const route = routes.findByName(routeName)
                  const params = {
                    locale,
                    id: connection.to.id.replace(`${connection.to.__typename}-`, ''),
                    name: connection.to.name
                  }

                  return (
                    <a key={data.id} ref={setRef}
                      href={route.getAs(params)}
                      onClick={e => {
                        e.preventDefault()

                        // ensure Android only navigates on second tap
                        // - matching iOS hover behaviour
                        if (!canHover || this.hoverNode !== node) {
                          RoutesRouter.pushRoute(routeName, params)
                            .then(() => {
                              window.scroll(0, 0)
                            })
                        }
                      }}
                      onTouchStart={() => {
                        if (this.hoverNode === node) {
                          this.hoverNode = undefined
                        } else {
                          this.hoverNode = node
                        }
                      }}
                      onMouseOver={canHover
                        ? () => this.setState({hover: node})
                        : undefined}
                      onMouseOut={canHover
                        ? () => {
                          this.setState({hover: null})
                          if (this.hoverNode === node) {
                            this.hoverNode = undefined
                          }
                        }
                        : undefined}
                      className={[
                        connection.indirect
                          ? style.connectionIndirect
                          : style.connection,
                        !isVisible && style.hidden
                      ].filter(Boolean).join(' ')}
                      style={{backgroundColor: POTENCY_COLORS[connection.potency]}}>
                      {connection.to.name}
                    </a>
                  )
                }
              })}
            </div>
          </div>
        </Center>
        {potency && <Legend
          locale={locale}
          title={t('connections/legend/title')}
          pagePath={t('connections/legend/path').split('/')}
          items={Object.keys(POTENCY_COLORS).map(key => ({
            label: t(`connections/legend/${key}`),
            color: POTENCY_COLORS[key]
          }))} />}
        {hasIndirect && <Legend
          locale={locale}
          title={t('connections/legend/type/title')}
          items={[
            {
              color: GREY_DARK,
              textColor: BLACK,
              label: t('connections/legend/direct')
            },
            {
              color: WHITE,
              label: t('connections/legend/indirect'),
              border: `1px solid ${GREY_DARK}`,
              textColor: BLACK
            }
          ]} />}
      </div>
    )
  }
}

export const hoverValues = [
  ['connections/context/function', ({data}) => data.connection['function']],
  [
    'connections/context/compensation',
    ({data: {connection, connection: {compensations}}}) => (
      !!compensations && compensations.length > 0 ||
      (
        connection.from &&
        connection.from.__typename === 'Parliamentarian' &&
        !connection.vias.length
      )
    ),
    ({data: {connection: {compensations}}}, {t}) => compensations.filter((e, i) => i < 3).map((compensation, i) =>
      <div key={`compensation-${i}`}>
        {compensation.year}{': '}
        {compensation.money !== null ?
          t.pluralize('connections/context/compensation/money', {
            count: compensation.money,
            formatted: chfFormat(compensation.money)
          }) +
          (compensation.description ? ` (${compensation.description})` : '')
        : t('connections/context/compensation/notAvailable')}
      </div>
    )
  ],
  [
    null,
    ({data: {connection: {paths}}}) => !!paths && paths.length,
    ({data: {connection: {paths}}}, {t, directness}) => paths.map((path, i) => (
      <ContextBoxValue key={`paths-${i}`}
        label={t(`connections/context/paths/${path.length > directness ? 'indirect' : 'direct'}`)}>
        <span>
          {[].concat(path).reverse().map((via, ii) => {
            const Icon = Icons[via.to.__typename]
            return <span key={ii} {...style.pathSegment}>
              <Icon className={style.pathSegmentIcon} size={16} />
              {via.to.name}<br />
            </span>
          })}
        </span>
      </ContextBoxValue>
    ))
  ]
]

const POTENCY_WEIGHT = {
  HIGH: 1000,
  MEDIUM: 50,
  LOW: 1
}

export const connectionWeight = connection => POTENCY_WEIGHT[connection.potency] || 1

Connections.propTypes = {
  directness: PropTypes.number.isRequired,
  groupByDestination: PropTypes.bool.isRequired,
  potency: PropTypes.bool.isRequired,
  connectionWeight: PropTypes.func.isRequired, // weight for sorting, default 1
  hoverValues: PropTypes.arrayOf(PropTypes.array).isRequired
}

Connections.defaultProps = {
  directness: 0,
  potency: false,
  intermediate: () => '',
  intermediates: [],
  groupByDestination: false,
  maxGroups: undefined,
  connectionWeight: connectionWeight,
  hoverValues
}

export default withT(Connections)
