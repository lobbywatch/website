import React from 'react'
import { css } from 'glamor'

import { mediaM } from '../theme'

const PADDING = 10
const gridStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  margin: `0 -${PADDING}px`,
})
const Grid = ({ children }) => <div {...gridStyle}>{children}</div>
export default Grid

const gridItemStyle = css({
  paddingLeft: PADDING,
  paddingRight: PADDING,
  width: '100%',
  [mediaM]: {
    width: '50%',
  },
})
export const GridItem = ({ children, paddingBottom }) => (
  <div {...gridItemStyle} style={{ paddingBottom }}>
    {children}
  </div>
)

GridItem.defaultProps = {
  paddingBottom: PADDING * 2,
}
