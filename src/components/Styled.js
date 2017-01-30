import React from 'react'
import NextLink from 'next/prefetch'
import {LW_BLUE, GREY_DARK, GREY_LIGHT, mediaM} from '../theme'
import {css} from 'glamor'

export const linkStyle = {
  textDecoration: 'none',
  color: LW_BLUE,
  ':visited': {
    color: LW_BLUE
  }
}
export const linkRule = css(linkStyle)
export const Link = ({children, className, ...props}) => (
  <NextLink {...props}><a {...linkRule}>{children}</a></NextLink>
)

export const h1Style = {
  fontSize: 42,
  lineHeight: '50px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 48,
    lineHeight: '56px'
  }
}
export const h1Rule = css(h1Style)
export const H1 = ({children, ...props}) => <h1 {...props} {...h1Rule}>{children}</h1>

export const h2Style = {
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 36,
    lineHeight: '42px'
  }
}
export const h2Rule = css(h2Style)
export const H2 = ({children, ...props}) => <h2 {...props} {...h2Rule}>{children}</h2>

export const h3Style = {
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 400
}
export const h3Rule = css(h3Style)
export const H3 = ({children, ...props}) => <h3 {...props} {...h3Rule}>{children}</h3>

export const h4Style = {
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 700
}
export const h4Rule = css(h4Style)
export const H4 = ({children, ...props}) => <h4 {...props} {...h4Rule}>{children}</h4>

export const pStyle = {
  fontSize: 16,
  lineHeight: '24px'
}
export const pRule = css(pStyle)
export const P = ({children, ...props}) => <p {...props} {...pRule}>{children}</p>

export const smallStyle = {
  fontSize: 14,
  lineHeight: '20px'
}
export const smallRule = css(smallStyle)
export const Small = ({children, ...props}) => <small {...props} {...smallRule}>{children}</small>

export const metaStyle = {
  fontSize: 12,
  lineHeight: '20px',
  color: GREY_DARK,
  [mediaM]: {
    fontSize: 14,
    lineHeight: '24px'
  }
}
export const metaRule = css(metaStyle)
export const Meta = ({children, ...props}) => <p {...props} {...metaRule}>{children}</p>

export const hrStyle = {
  margin: '30px 0',
  border: 'none',
  borderTop: `1px solid ${GREY_LIGHT}`
}
export const hrRule = css(hrStyle)
export const Hr = ({children, ...props}) => <hr {...props} {...hrRule} />