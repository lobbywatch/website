import React, {Component} from 'react'
import {css, merge} from 'glamor'
import {nest} from 'd3-collection'

import {LW_BLUE_DARK, WHITE, GREY_LIGHT} from '../theme'
import GuestIcon from '../assets/Guest'

const containerStyle = css({
  backgroundColor: GREY_LIGHT,
  padding: '20px 10px 10px'
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
  color: LW_BLUE_DARK
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

class Connections extends Component {
  render () {
    const {data} = this.props

    const tree = nest()
      .key(connection => connection.via ? connection.via.name : '')
      .key(connection => connection.sector || 'Sonstiges')
      .entries(data)

    return (
      <div {...containerStyle}>
        {tree.map(({key: via, values: groups}) => {
          return (
            <div key={via} style={{textAlign: 'center'}}>
              {!!via && <span><span {...bubbleViaStyle}><GuestIcon className={iconStyle} /> {via}</span><br /></span>}
              {groups.map(({key, values}) => {
                return (
                  <span key={key} className={via ? bubbleViaStyle : bubbleStyle}>
                    <span className={via ? countViaStyle : countStyle}>{values.length}</span> {key}
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

export default Connections
