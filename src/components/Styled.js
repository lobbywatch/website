import React from 'react'
import NextLink from 'next/prefetch'
import {LW_BLUE, GREY_DARK, mediaM} from '../theme'
import {css} from 'glamor'

const linkStyle = css({
  color: LW_BLUE
})
export const Link = ({children, className, ...props}) => (
  <NextLink {...props}><a {...linkStyle}>{children}</a></NextLink>
)

const h1Style = css({
  fontSize: 42,
  lineHeight: '50px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 48,
    lineHeight: '56px'
  }
})
export const H1 = ({children, ...props}) => <h1 {...props} {...h1Style}>{children}</h1>

const h2Style = css({
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 36,
    lineHeight: '42px'
  }
})
export const H2 = ({children, ...props}) => <h2 {...props} {...h2Style}>{children}</h2>

const h3Style = css({
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 400
})
export const H3 = ({children, ...props}) => <h3 {...props} {...h3Style}>{children}</h3>

const h4Style = css({
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 700
})
export const H4 = ({children, ...props}) => <h4 {...props} {...h4Style}>{children}</h4>

const pStyle = css({
  fontSize: 16,
  lineHeight: '24px'
})
export const P = ({children, ...props}) => <p {...props} {...pStyle}>{children}</p>

const smallStyle = css({
  fontSize: 14,
  lineHeight: '20px'
})
export const Small = ({children, ...props}) => <small {...props} {...smallStyle}>{children}</small>

export const metaStyle = css({
  fontSize: 12,
  lineHeight: '20px',
  color: GREY_DARK,
  [mediaM]: {
    fontSize: 14,
    lineHeight: '24px'
  }
})
