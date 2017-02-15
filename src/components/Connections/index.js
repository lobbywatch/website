import React, {PropTypes, Component} from 'react'

import {WHITE, POTENCY_COLORS} from '../../theme'
import GuestIcon from '../../assets/Guest'
import ContextBox, {ContextBoxValue} from '../ContextBox'
import {metaRule} from '../Styled'
import Legend from './Legend'
import Message, {withT} from '../Message'
import {shallowEqual, intersperse} from '../../utils/helpers'
import {chfFormat} from '../../utils/formats'
import {Link as RawRouteLink} from '../../../routes'
import layout, {START_Y} from './layout'
import nest from './nest'
import * as style from './style'

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
    const height = layout(this.state)

    const {nodes, links} = this.state
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
      updated, published
    } = this.props
    let viaI = 0

    const getVisible = parent => !parent || open[parent.data.id]

    return (
      <div {...style.container} ref={ref => { this.containerRef = ref }}>
        {!!hover && !!width && <ContextBox x={hover.x + hover.data.measurements.width / 2} y={hover.y - 15} contextWidth={width}>
          <ContextBoxValue label={t('connections/context/group')}>{hover.data.connection.group}</ContextBoxValue>
          <ContextBoxValue label={t('connections/context/function')}>{hover.data.connection.function}</ContextBoxValue>
          {!!hover.data.connection.compensation && (<ContextBoxValue label={t('connections/context/compensation')}>
            {chfFormat(hover.data.connection.compensation.money)}
            {' '}{t('connections/context/compensation/periode')}
            {!!hover.data.connection.compensation.description && ` (${hover.data.connection.compensation.description})`}
          </ContextBoxValue>)}
          {!!hover.data.connection.vias && (<ContextBoxValue label={t('connections/context/vias')}>
            <span>
              {hover.data.connection.vias.map((via, i) => {
                if (!via) {
                  return <span key={i}>{t('connections/context/vias/direct')}<br /></span>
                }
                return <span key={i}>{via.name}<br /></span>
              })}
            </span>
          </ContextBoxValue>)}
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
          {potency && <Legend locale={locale} />}
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
                  style={{cursor: 'pointer'}}>
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
                  className={!isVisible && style.hidden}
                  onClick={toggle}
                  style={{cursor: children && children.length ? 'pointer' : ''}}>
                  <GuestIcon className={style.icon} /> {data.label}
                </span>
                {!!isLast && <br />}
              </span>)
            }
            if (data.type === 'Connection') {
              const {connection} = data
              return (
                <RawRouteLink key={data.id}
                  route={connection.to.__typename.toLowerCase()}
                  params={{
                    locale,
                    id: connection.to.id.replace(`${connection.to.__typename}-`, ''),
                    name: connection.to.name
                  }}>
                  <a ref={setRef}
                    onMouseOver={() => this.setState({hover: node})}
                    onMouseOut={() => this.setState({hover: null})}
                    {...style.connection}
                    className={!isVisible && style.hidden}
                    style={{backgroundColor: POTENCY_COLORS[connection.potency]}}>
                    {connection.to.name}
                  </a>
                </RawRouteLink>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

Connections.propTypes = {
  potency: PropTypes.bool.isRequired,
  connectionWeight: PropTypes.func.isRequired // weight for sorting, default 1
}

Connections.defaultProps = {
  potency: false,
  intermediate: () => '',
  intermediates: [],
  maxGroups: undefined,
  connectionWeight: () => 1
}

export default withT(Connections)
