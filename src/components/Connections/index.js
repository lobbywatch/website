import React, {PropTypes, Component} from 'react'
import {css, merge} from 'glamor'
import {nest} from 'd3-collection'
import {formatLocale} from 'd3-format'
import {stratify} from 'd3-hierarchy'
import {descending} from 'd3-array'

import {LW_BLUE_DARK, WHITE, GREY_LIGHT, GREY_DARK, POTENCY_COLORS} from '../../theme'
import GuestIcon from '../../assets/Guest'
import ContextBox, {ContextBoxValue} from '../ContextBox'
import Legend from './Legend'
import {withT} from '../Message'
import {shallowEqual} from '../../utils/helpers'
import {Link as NextRouteLink} from '../../../routes'

const swissNumbers = formatLocale({
  decimal: '.',
  thousands: "'",
  grouping: [3],
  currency: ['', '\u00a0CHF']
})
const chfFormat = swissNumbers.format('$,.0f')

const containerStyle = css({
  position: 'relative',
  backgroundColor: GREY_LIGHT,
  padding: '0 0 20px'
})
const rootStyle = css({
  position: 'absolute',
  left: '50%',
  top: 0
})
const bubbleStyle = css({
  display: 'inline-block',
  fontSize: 14,
  lineHeight: '24px',
  backgroundColor: LW_BLUE_DARK,
  color: WHITE,
  borderRadius: 20,
  padding: '8px 16px',
  marginRight: 10,
  marginBottom: 10,
  minHeight: 40,
  zIndex: 1
})
const bubbleViaStyle = merge(bubbleStyle, {
  color: LW_BLUE_DARK,
  backgroundColor: WHITE,
  border: `1px solid ${LW_BLUE_DARK}`
})
const countStyle = css({
  display: 'inline-block',
  height: 24,
  minWidth: 24,
  textAlign: 'center',
  borderRadius: 12,
  marginLeft: -8,
  padding: '0 8px',
  marginRight: 3,
  backgroundColor: WHITE,
  color: LW_BLUE_DARK,
  fontWeight: 500
})
const countViaStyle = merge(countStyle, {
  color: WHITE,
  backgroundColor: LW_BLUE_DARK
})
const iconStyle = css({
  marginLeft: -8,
  marginRight: 3,
  verticalAlign: 'middle'
})

const connectionStyle = css({
  display: 'inline-block',
  textDecoration: 'none',
  borderRadius: 8,
  backgroundColor: GREY_DARK,
  color: WHITE,
  fontSize: 14,
  lineHeight: '16px',
  padding: '5px 10px',
  verticalAlign: 'middle',
  marginRight: 10,
  marginBottom: 10
})

const hiddenStyle = css({
  position: 'absolute',
  left: 0,
  top: 0,
  visibility: 'hidden'
})

class Connections extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      open: {}
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
  nestData (state, {data, intermediate, intermediates, maxGroups, connectionWeight, t}) {
    const moreKey = t('connections/more/plural')
    const groupTree = nest()
      .key(intermediate)
      .key(connection => connection.group ? connection.group : moreKey)
      .entries(data)

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

    const open = {
      ...state.open,
      Root: true
    }

    let nextState = {
      hover: null,
      width: undefined,
      nodes,
      links,
      hierarchy,
      open
    }

    return nextState
  }
  layout () {
    const {
      hierarchy,
      nodes, links,
      width, open
    } = this.state

    const MARGIN = 10

    let y = 48
    let x = 0
    let row = 0
    const nextRow = (rowHeight) => {
      x = 0
      y += rowHeight + MARGIN
      row += 1
    }
    const visit = (node) => {
      const isOpen = open[node.data.id]
      if (isOpen) {
        let lastType
        let rowHeight = 0
        let rowChildren = []
        let openChildren = []
        const newRow = () => {
          const xLeftOver = width - x
          const xPush = xLeftOver / 2 // center
          rowChildren.forEach(rowChild => {
            rowChild.x += xPush
          })
          nextRow(rowHeight)
          rowHeight = 0
          rowChildren = []
          if (openChildren.length) {
            openChildren.forEach(visit)
            openChildren = []
          }
        }
        node.children.forEach(child => {
          const measurements = child.data.measurements

          if (
            (x + measurements.width > width) ||
            (lastType && lastType !== child.data.type)
          ) {
            newRow()
          }

          child.x = x
          child.y = y
          child.row = row
          rowHeight = Math.max(measurements.height, rowHeight)
          rowChildren.push(child)
          x += measurements.width + MARGIN
          if (open[child.data.id]) {
            openChildren.push(child)
          }
          lastType = child.data.type
        })
        newRow()
      }
    }
    visit(hierarchy)
    hierarchy.y = 0
    hierarchy.x = width / 2

    nodes.forEach(({x, y, data, ref}) => {
      ref.style.position = 'absolute'
      ref.style.left = `${x}px`
      ref.style.top = `${y}px`
      ref.style.margin = '0'
    })

    links.forEach(({ref, source, target}) => {
      if (ref) {
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

    const height = y + 20
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
    const {locale, t, intermediates} = this.props
    let viaI = 0

    const getVisible = parent => !parent || open[parent.data.id]

    return (
      <div {...containerStyle} ref={ref => { this.containerRef = ref }}>
        {!!hover && !!width && <ContextBox x={hover.x + hover.data.measurements.width / 2} y={hover.y - 15} contextWidth={width}>
          <ContextBoxValue label={t('connections/context/group')}>{hover.data.connection.group}</ContextBoxValue>
          <ContextBoxValue label={t('connections/context/function')}>{hover.data.connection.function}</ContextBoxValue>
          {!!hover.data.connection.compensation && (<ContextBoxValue label={t('connections/context/compensation')}>
            {chfFormat(hover.data.connection.compensation.money)}
            {' '}{t('connections/context/compensation/periode')}
            {!!hover.data.connection.compensation.description && ` (${hover.data.connection.compensation.description})`}
          </ContextBoxValue>)}
        </ContextBox>}
        <svg width={width} ref={ref => { this.svgRef = ref }} style={{position: 'absolute', top: 0, left: 0}}>
          {!!width && links.map(({source, target, setRef}, i) => {
            const visible = getVisible(source.parent) && getVisible(target.parent)
            if (visible) {
              return <path key={i} ref={setRef}
                fill='none' stroke={WHITE} strokeWidth={2} />
            }
          })}
        </svg>
        <div style={{textAlign: 'center', position: 'relative'}}>
          <Legend locale={locale} />
          {nodes.map((node) => {
            const {data, setRef, children, parent} = node
            const isVisible = getVisible(parent)
            const isOpen = open[data.id]
            const toggle = () => {
              let nextOpen = {
                ...open,
                [data.id]: !isOpen
              }
              if (isOpen) {
                children.forEach(({data: childData}) => {
                  if (nextOpen[childData.id]) {
                    nextOpen[childData.id] = false
                  }
                })
              }
              this.setState({open: nextOpen})
            }
            if (data.type === 'Root') {
              return <span key={data.id} ref={setRef} {...rootStyle} />
            }
            if (data.type === 'Group') {
              const indirect = data.parentId !== 'Root'
              return (
                <span key={data.id} ref={setRef}
                  className={[
                    (indirect ? bubbleViaStyle : bubbleStyle),
                    !isVisible && hiddenStyle
                  ].filter(Boolean).join(' ')}
                  onClick={toggle}
                  style={{cursor: 'pointer'}}>
                  <span className={indirect ? countViaStyle : countStyle}>{data.count}</span> {data.label}
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
                  {...bubbleViaStyle}
                  className={!isVisible && hiddenStyle}
                  onClick={toggle}
                  style={{cursor: children && children.length ? 'pointer' : ''}}>
                  <GuestIcon className={iconStyle} /> {data.label}
                </span>
                {!!isLast && <br />}
              </span>)
            }
            if (data.type === 'Connection') {
              const {connection} = data
              return (
                <NextRouteLink key={data.id}
                  route={connection.to.__typename.toLowerCase()}
                  params={{
                    locale,
                    id: connection.to.id.replace(`${connection.to.__typename}-`, ''),
                    name: connection.to.name
                  }}>
                  <a ref={setRef}
                    onMouseOver={() => this.setState({hover: node})}
                    onMouseOut={() => this.setState({hover: null})}
                    {...connectionStyle}
                    className={!isVisible && hiddenStyle}
                    style={{backgroundColor: POTENCY_COLORS[connection.potency]}}>
                    {connection.to.name}
                  </a>
                </NextRouteLink>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

Connections.propTypes = {
  connectionWeight: PropTypes.func.isRequired // weight for sorting, default 1
}

Connections.defaultProps = {
  intermediate: () => '',
  intermediates: [],
  maxGroups: undefined,
  connectionWeight: () => 1
}

export default withT(Connections)
