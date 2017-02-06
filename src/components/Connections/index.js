import React, {Component} from 'react'
import {css, merge} from 'glamor'
import {nest} from 'd3-collection'
import {formatLocale} from 'd3-format'
import {stratify} from 'd3-hierarchy'
import {descending} from 'd3-array'

import {LW_BLUE_DARK, WHITE, GREY_LIGHT, BLACK, POTENCY_COLORS} from '../../theme'
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
  padding: '10px 0 0'
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
  backgroundColor: BLACK,
  color: WHITE,
  fontSize: 14,
  lineHeight: '16px',
  padding: '5px 10px',
  verticalAlign: 'middle',
  marginRight: 10,
  marginBottom: 10
})

const MAX_GROUPS = 5

class Connections extends Component {
  constructor (props) {
    super(props)
    this.nodeRefs = {}
    this.state = {
      nodes: []
    }

    this.measure = () => {
      const {nodes} = this.state

      const containerRect = this.containerRef.getBoundingClientRect()

      nodes.forEach(({data}) => {
        const ref = this.nodeRefs[data.id]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const y = window.scrollX + (rect.top - containerRect.top)
          data.bounds = {
            cx: window.scrollX + (rect.width / 2 + rect.left - containerRect.left),
            y: y,
            cy: y - (rect.height / 2)
          }
        }
      })

      const width = containerRect.width
      if (width !== this.state.width) {
        this.setState({width})
      }
    }
  }
  nestData (state, {data, vias, t}) {
    const moreKey = t('connections/more/plural')
    const groupTree = nest()
      .key(connection => connection.via ? connection.via.id : '')
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
      vias.map(via => ({
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

    let nextState = {
      nodes: hierarchy.descendants(),
      hierarchy
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
    const {nodes, hover, width} = this.state
    const {locale, t, vias} = this.props
    let viaI = 0

    return (
      <div {...containerStyle} ref={ref => { this.containerRef = ref }}>
        {!!hover && !!width && <ContextBox x={hover.bounds.cx} y={hover.bounds.y - 15} contextWidth={width}>
          <ContextBoxValue label={t('connections/context/sector')}>{hover.connection.sector}</ContextBoxValue>
          <ContextBoxValue label={t('connections/context/group')}>{hover.connection.group}</ContextBoxValue>
          <ContextBoxValue label={t('connections/context/function')}>{hover.connection.function}</ContextBoxValue>
          {!!hover.connection.compensation && (<ContextBoxValue label={t('connections/context/compensation')}>
            {chfFormat(hover.connection.compensation.money)}
            {' '}{t('connections/context/compensation/periode')}
            {' '}({hover.connection.compensation.description})
          </ContextBoxValue>)}
        </ContextBox>}
        <Legend locale={locale} />
        <div style={{textAlign: 'center', 'position': 'relative'}}>
          {nodes.map(({data, children}) => {
            if (data.type === 'Root') {
              return <span key={data.id} ref={data.ref} />
            }
            if (data.type === 'Group') {
              const indirect = data.parentId !== 'Root'
              return (
                <span key={data.id} ref={data.ref}
                  className={indirect ? bubbleViaStyle : bubbleStyle}
                  style={{cursor: 'pointer'}}>
                  <span className={indirect ? countViaStyle : countStyle}>{data.count}</span> {data.label}
                </span>
              )
            }
            if (data.type === 'Guest') {
              let isFirst = viaI === 0
              viaI += 1
              let isLast = viaI === vias.length
              return (<span key={data.id}>
                {!!isFirst && <br />}
                <span ref={data.ref}
                  {...bubbleViaStyle}
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
                style={{backgroundColor: POTENCY_COLORS[connection.potency], position: 'absolute', left: 0, visibility: 'hidden'}}>
                {connection.to.name}
              </span>)
            }
          })}
        </div>
      </div>
    )
  }
}

export default withT(Connections)
