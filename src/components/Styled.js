import React from 'react'
import NextLink from 'next/prefetch'
import {Link as NextRouteLink} from '../../routes'
import {LW_BLUE, GREY_DARK, GREY_LIGHT, GREY_MID, WHITE, GREY_SOFT, mediaM} from '../theme'
import {css, merge} from 'glamor'

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
export const RouteLink = ({children, className, ...props}) => (
  <NextRouteLink {...props}><a {...linkRule}>{children}</a></NextRouteLink>
)

export const A = ({children, ...props}) => <a {...props} {...linkRule}>{children}</a>

export const buttonLinkStyle = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  backgroundColor: LW_BLUE,
  color: WHITE,
  borderRadius: 4,
  minWidth: 160,
  padding: 11
}
export const buttonLinkRule = css(buttonLinkStyle)
export const ButtonLink = ({children, className, ...props}) => (
  <NextLink {...props}><a {...buttonLinkRule}>{children}</a></NextLink>
)
export const ButtonRouteLink = ({children, className, ...props}) => (
  <NextRouteLink {...props}><a {...buttonLinkRule}>{children}</a></NextRouteLink>
)

export const h1Style = {
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 36,
    lineHeight: '42px'
  }
}
export const h1Rule = css(h1Style)
export const H1 = ({children, ...props}) => <h1 {...props} {...h1Rule}>{children}</h1>

export const h2Style = {
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 400
}
export const h2Rule = css(h2Style)
export const H2 = ({children, ...props}) => <h2 {...props} {...h2Rule}>{children}</h2>

export const h3Style = {
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 700
}
export const h3Rule = css(h3Style)
export const H3 = ({children, ...props}) => <h3 {...props} {...h3Rule}>{children}</h3>

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

export const strongStyle = {
  fontWeight: 700
}
export const strongRule = css(strongStyle)
export const Strong = ({children, ...props}) => <strong {...props} {...strongRule}>{children}</strong>

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

export const inputStyle = {
  appearance: 'none',
  width: '100%',
  border: `1px solid ${GREY_LIGHT}`,
  textOverflow: 'ellipsis',
  paddingLeft: 8,
  paddingRight: 8,
  height: 40,
  borderRadius: 4,
  backgroundColor: GREY_SOFT,
  [mediaM]: {
    paddingLeft: 16,
    paddingRight: 16
  },
  '::placeholder': {
    color: GREY_LIGHT,
    textOverflow: 'ellipsis'
  },
  ':focus': {
    outline: 'none',
    borderColor: GREY_MID
  },
  '::-ms-clear': {
    width: 0,
    height: 0
  }
}
export const inputRule = css(inputStyle)
export const Input = ({children, ...props}) => <input {...props} {...inputRule} />

export const submitStyle = {
  backgroundColor: LW_BLUE,
  color: WHITE,
  border: 'none',
  cursor: 'pointer'
}
export const submitRule = merge(inputStyle, submitStyle)
export const Submit = ({children, ...props}) => <input type='submit' {...props} {...submitRule} />
