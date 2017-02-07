import React, {Component} from 'react'
import {css, merge} from 'glamor'
import {nest} from 'd3-collection'
import {formatLocale} from 'd3-format'
import {stratify} from 'd3-hierarchy'
import {descending} from 'd3-array'

import {LW_BLUE_DARK, WHITE, GREY_LIGHT, GREY_DARK, POTENCY_COLORS} from '../../theme'
import GuestIcon from '../../assets/Guest'
import ContextBox, {ContextBoxValue} from '../ContextBox'
import Legend from './Legend'
import {withT} from '../../utils/translate'
import {shallowEqual} from '../../utils/helpers'

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
  minHeight: 40
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

const MAX_GROUPS = 5

class Connections extends Component {
  constructor (props) {
    super(props)
    this.nodeRefs = {}
    this.state = {
      nodes: [],
      links: [],
      open: {}
    }

    this.measure = () => {
      const {nodes, open} = this.state

      const containerRect = this.containerRef.getBoundingClientRect()

      let height = 0
      nodes.forEach(({data}) => {
        const ref = this.nodeRefs[data.id]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const y = window.scrollX + (rect.top - containerRect.top)
          data.bounds = {
            cx: window.scrollX + (rect.width / 2 + rect.left - containerRect.left),
            y: y,
            ey: y + rect.height
          }
          height = Math.max(height, y + rect.height)
        }
      })

      // tmp hack to trigger re-render
      height += Object.keys(open)
        .map(key => open[key])
        .filter(Boolean).length

      const width = containerRect.width
      if (width !== this.state.width || height !== this.state.height) {
        this.setState({width, height})
      }
    }
  }
  nestData (state, {data, intermediate, intermediates, t}) {
    const moreKey = t('connections/more/plural')
    const groupTree = nest()
      .key(intermediate)
      .key(connection => connection.group ? connection.group : moreKey)
      .entries(data)

    const nodes = groupTree.reduce(
      (rootAccumulator, viaLevel) => {
        viaLevel.values.sort((a, b) => descending(a.values.length, b.values.length))

        const more = viaLevel.values.find(group => group.key === moreKey) || {
          key: moreKey,
          values: []
        }
        const groups = viaLevel.values.filter(group => group.key !== moreKey)
        const moreGroups = groups.slice(MAX_GROUPS)
        let visibleGroups = groups.slice(0, MAX_GROUPS)
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
    nodes.unshift({
      id: 'Root',
      type: 'Root'
    })

    nodes.forEach(node => {
      node.ref = ref => {
        this.nodeRefs[node.id] = ref
      }
    })

    const hierarchy = stratify()(nodes)

    const open = {
      ...state.open,
      Root: true
    }

    let nextState = {
      width: undefined,
      height: undefined,
      nodes: hierarchy.descendants(),
      links: hierarchy.links(),
      hierarchy,
      open
    }

    return nextState
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
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.measure)
  }
  render () {
    const {
      nodes, links, hover, open,
      width, height
    } = this.state
    const {locale, t, intermediates} = this.props
    let viaI = 0

    const getVisible = parent => !parent || open[parent.data.id]

    return (
      <div {...containerStyle} ref={ref => { this.containerRef = ref }}>
        {!!hover && !!width && <ContextBox x={hover.bounds.cx} y={hover.bounds.y - 15} contextWidth={width}>
          <ContextBoxValue label={t('connections/context/group')}>{hover.connection.group}</ContextBoxValue>
          <ContextBoxValue label={t('connections/context/function')}>{hover.connection.function}</ContextBoxValue>
          {!!hover.connection.compensation && (<ContextBoxValue label={t('connections/context/compensation')}>
            {chfFormat(hover.connection.compensation.money)}
            {' '}{t('connections/context/compensation/periode')}
            {!!hover.connection.compensation.description && ` (${hover.connection.compensation.description})`}
          </ContextBoxValue>)}
        </ContextBox>}
        <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0}}>
          {!!width && links.map(({source, target}, i) => {
            const visible = getVisible(source.parent) && getVisible(target.parent)
            if (visible && source.data.bounds && target.data.bounds) {
              const sBounds = source.data.bounds
              const tBounds = target.data.bounds
              return <path key={i} fill='none' stroke={WHITE} strokeWidth={2} d={(
                'M' + sBounds.cx + ',' + sBounds.ey +
                'C' + sBounds.cx + ',' + (sBounds.ey + tBounds.y) / 2 +
                ' ' + tBounds.cx + ',' + (sBounds.ey + tBounds.y) / 2 +
                ' ' + tBounds.cx + ',' + tBounds.y
                // 'M' + sBounds.cx + ',' + sBounds.ey +
                // 'C' + (sBounds.cx + tBounds.cx) / 2 + ',' + sBounds.ey +
                // ' ' + (sBounds.cx + tBounds.cx) / 2 + ',' + tBounds.y +
                // ' ' + tBounds.cx + ',' + tBounds.y
              )} />
            }
          })}
        </svg>
        <div style={{textAlign: 'center', position: 'relative'}}>
          <Legend locale={locale} />
          {nodes.map(({data, children, parent}) => {
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
              return <span key={data.id} ref={data.ref} {...rootStyle} />
            }
            if (data.type === 'Group') {
              const indirect = data.parentId !== 'Root'
              return (
                <span key={data.id} ref={data.ref}
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
                <span ref={data.ref}
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
              // return null
              return (<span key={data.id} ref={data.ref}
                onMouseOver={() => this.setState({hover: data})}
                onMouseOut={() => this.setState({hover: null})}
                {...connectionStyle}
                className={!isVisible && hiddenStyle}
                style={{backgroundColor: POTENCY_COLORS[connection.potency]}}>
                {connection.to.name}
              </span>)
            }
          })}
        </div>
      </div>
    )
  }
}

Connections.defaultProps = {
  intermediate: () => '',
  intermediates: []
}

export default withT(Connections)
