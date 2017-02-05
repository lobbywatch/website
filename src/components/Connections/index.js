import React, {Component} from 'react'
import {css, merge} from 'glamor'
import {nest} from 'd3-collection'
import {formatLocale} from 'd3-format'

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
  minHeight: 40,
  cursor: 'pointer'
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

const nestData = (state, {data, vias, t}) => {
  const tree = nest()
    .key(connection => connection.via ? connection.via.name : '')
    .key(connection => connection.group || t('connections/more/plural'))
    .entries(data)

  vias.forEach(via => {
    if (!tree.filter(({key}) => key === via.name)[0]) {
      tree.push({
        key: via.name,
        values: []
      })
    }
  })

  let nextState = {
    tree
  }
  if (state.open === undefined) {
    nextState.open = [tree[0].key, tree[0].values[0].key]
  }

  return nextState
}

class Connections extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tree: []
    }
  }
  componentWillMount () {
    this.setState(nestData)
  }
  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(this.props, nextProps)) {
      this.setState(nestData(this.state, nextProps))
    }
  }
  render () {
    const {tree, open, hover} = this.state
    const {locale, t} = this.props

    return (
      <div {...containerStyle} ref={ref => { this.containerRef = ref }}>
        {!!hover && <ContextBox x={hover.x} y={hover.y} contextWidth={hover.contextWidth}>
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
        {tree.map(({key: via, values: groups}) => {
          return (
            <div key={via} style={{textAlign: 'center'}}>
              {!!via && (<span><span {...bubbleViaStyle} style={{opacity: !open || open[0] === via ? 1 : 0.5}}>
                <GuestIcon className={iconStyle} /> {via}</span><br />
              </span>)}
              {groups.map(({key, values}, i) => {
                const isOpen = open && open[0] === via && open[1] === key
                return (
                  <span key={key}>
                    <span
                      className={via ? bubbleViaStyle : bubbleStyle}
                      style={{opacity: !open || isOpen ? 1 : 0.5}}
                      onClick={() => this.setState({open: isOpen ? null : [via, key]})}>
                      <span className={via ? countViaStyle : countStyle}>{values.length}</span> {key}
                    </span>
                    {isOpen && <br />}
                    {isOpen && values.map((connection, i) => (
                      <span key={i}
                        onMouseOver={e => {
                          const containerRect = this.containerRef.getBoundingClientRect()
                          const rect = e.currentTarget.getBoundingClientRect()
                          this.setState({hover: {
                            connection,
                            contextWidth: containerRect.width,
                            x: window.scrollX + (rect.width / 2 + rect.left - containerRect.left),
                            y: window.scrollX + (rect.top - containerRect.top) - 15
                          }})
                        }}
                        onMouseOut={() => this.setState({hover: null})}
                        {...connectionStyle}
                        style={{backgroundColor: POTENCY_COLORS[connection.potency]}}>
                        {connection.to.name}
                      </span>
                    ))}
                    {isOpen && <br />}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default withT(Connections)
