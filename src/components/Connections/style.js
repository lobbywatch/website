import {css, merge} from 'glamor'

import {LW_BLUE_DARK, WHITE, GREY_LIGHT, GREY_DARK} from '../../theme'

export const container = css({
  position: 'relative',
  backgroundColor: GREY_LIGHT,
  padding: '0 0 20px'
})
export const root = css({
  position: 'absolute',
  left: '50%',
  top: 0
})
export const bubble = css({
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
export const bubbleVia = merge(bubble, {
  color: LW_BLUE_DARK,
  backgroundColor: WHITE,
  border: `1px solid ${LW_BLUE_DARK}`
})
export const count = css({
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
export const countVia = merge(count, {
  color: WHITE,
  backgroundColor: LW_BLUE_DARK
})
export const icon = css({
  marginLeft: -8,
  marginRight: 3,
  verticalAlign: 'middle'
})

export const connection = css({
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

export const hidden = css({
  position: 'absolute',
  left: 0,
  top: 0,
  visibility: 'hidden'
})
