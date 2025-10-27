import { css, merge } from 'glamor'

import { mediaM } from '../../theme'
import { plainButtonRule } from '../Styled'

export const edge = css({
  position: 'relative',
  backgroundColor: 'var(--colorGreyLight)',
  marginBottom: 20,
})
export const container = css({
  position: 'relative',
})
export const root = css({
  position: 'absolute',
  left: '50%',
  top: 0,
})
export const bubble = css(plainButtonRule, {
  display: 'inline-block',
  fontSize: 14,
  lineHeight: '24px',
  backgroundColor: 'var(--colorPrimaryDark)',
  color: 'var(--colorWhite)',
  borderRadius: 20,
  padding: '8px 16px',
  marginRight: 10,
  marginBottom: 10,
  minHeight: 40,
  zIndex: 1,
})
export const bubbleVia = merge(bubble, {
  color: 'var(--colorPrimaryDark)',
  backgroundColor: 'var(--colorWhite)',
  border: '1px solid var(--colorPrimaryDark)',
  textDecoration: 'none',
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
  backgroundColor: 'var(--colorWhite)',
  color: 'var(--colorPrimaryDark)',
  fontWeight: 500,
})
export const countVia = merge(count, {
  color: 'var(--colorWhite)',
  backgroundColor: 'var(--colorPrimaryDark)',
})
export const icon = css({
  marginLeft: -8,
  marginRight: 3,
  verticalAlign: 'middle',
})

export const connection = css({
  display: 'inline-block',
  textDecoration: 'none',
  borderRadius: 8,
  backgroundColor: 'var(--colorGreyDark)',
  color: 'var(--colorWhite)',
  fontSize: 14,
  lineHeight: '16px',
  padding: '5px 10px',
  verticalAlign: 'middle',
  marginRight: 10,
  marginBottom: 10,
})
export const connectionIndirect = merge(connection, {
  backgroundColor: 'var(--colorWhite)',
  color: 'var(--colorGreyDark)',
  border: '1px solid var(--colorGreyDark)',
})

export const hidden = css({
  position: 'absolute',
  left: 0,
  top: 0,
  visibility: 'hidden',
})

export const metaBox = css({
  textAlign: 'center',
  lineHeight: '16px',
  [mediaM]: {
    lineHeight: '20px',
  },
  padding: 10,
})

export const pathSegment = css({
  position: 'relative',
  display: 'block',
  paddingLeft: 20,
})

export const pathSegmentFunction = css({
  color: 'var(--colorGreyDark)',
})

export const pathSegmentIcon = css({
  position: 'absolute',
  top: 2,
  left: 0,
})
