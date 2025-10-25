import React, { ReactNode } from 'react'
import NextLink, { LinkProps } from 'next/link'
import {
  LW_BLUE,
  LW_BLUE_HOVER,
  GREY_DARK,
  GREY_LIGHT,
  GREY_MID,
  WHITE,
  GREY_SOFT,
  mediaM,
} from '../theme'
import { css, merge } from 'glamor'

export const plainButtonRule = css({
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  fontStyle: 'inherit',
  color: 'inherit',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  padding: 0,
})

export const linkStyle = {
  textDecoration: 'none',
  color: LW_BLUE,
  ':visited': {
    color: LW_BLUE,
  },
  ':hover': {
    color: LW_BLUE_HOVER,
  },
}

export interface NextLinkWithChildren extends LinkProps {
  className?: string
  children?: ReactNode
}

const linkRule = css(linkStyle)
export const StyledLink = ({ children, ...props }: NextLinkWithChildren) => (
  <NextLink {...props} {...linkRule}>
    {children}
  </NextLink>
)

export const A = React.forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements['a']
>(({ children, ...props }, ref) => (
  <a ref={ref} {...props} {...linkRule}>
    {children}
  </a>
))
A.displayName = 'A'

export const buttonLinkStyle = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  backgroundColor: LW_BLUE,
  color: WHITE,
  borderRadius: 4,
  minWidth: 160,
  padding: 11,
  ':hover': {
    backgroundColor: LW_BLUE_HOVER,
  },
}
export const buttonLinkRule = css(buttonLinkStyle)
export const ButtonLink = ({ children, ...props }: NextLinkWithChildren) => (
  <NextLink {...props} {...buttonLinkRule}>
    {children}
  </NextLink>
)

const textCenterRule = css({ textAlign: 'center' })
export const TextCenter = React.forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} {...textCenterRule}>
    {children}
  </div>
))
TextCenter.displayName = 'TextCenter'

export const h1Style = {
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 300,
  [mediaM]: {
    fontSize: 36,
    lineHeight: '42px',
  },
  margin: '0.7em 0',
}
export const h1Rule = css(h1Style)
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements['h1']
>(({ children, ...props }, ref) => (
  <h1 ref={ref} {...props} {...h1Rule}>
    {children}
  </h1>
))
H1.displayName = 'H1'

export const h2Style = {
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 400,
  margin: '0.8em 0',
}
export const h2Rule = css(h2Style)
export const H2 = React.forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements['h2']
>(({ children, ...props }, ref) => (
  <h2 ref={ref} {...props} {...h2Rule}>
    {children}
  </h2>
))
H2.displayName = 'H2'

export const h3Style = {
  fontSize: 18,
  lineHeight: '24px',
  fontWeight: 700,
  margin: '0 0 1em',
}
export const h3Rule = css(h3Style)
export const H3 = React.forwardRef<
  HTMLHeadingElement,
  JSX.IntrinsicElements['h3']
>(({ children, ...props }, ref) => (
  <h3 ref={ref} {...props} {...h3Rule}>
    {children}
  </h3>
))
H3.displayName = 'H3'

export const pStyle = {
  fontSize: 16,
  lineHeight: '24px',
}
export const pRule = css(pStyle)
export const P = React.forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements['p']
>(({ children, ...props }, ref) => (
  <p ref={ref} {...props} {...pRule}>
    {children}
  </p>
))
P.displayName = 'P'

export const smallStyle = {
  fontSize: 14,
  lineHeight: '20px',
}

export const metaStyle = {
  fontSize: 12,
  lineHeight: '14px',
  color: GREY_DARK,
  [mediaM]: {
    fontSize: 14,
    lineHeight: '18px',
  },
}
export const metaRule = css(metaStyle)
export const Meta = React.forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements['p']
>(({ children, ...props }, ref) => (
  <p ref={ref} {...props} {...metaRule}>
    {children}
  </p>
))
Meta.displayName = 'Meta'

export const hrStyle = {
  margin: '30px 0',
  border: 'none',
  borderTop: `1px solid ${GREY_LIGHT}`,
}
export const hrRule = css(hrStyle)
export const Hr = React.forwardRef<HTMLHRElement, JSX.IntrinsicElements['hr']>(
  (props, ref) => <hr ref={ref} {...props} {...hrRule} />,
)
Hr.displayName = 'Hr'

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
    paddingRight: 16,
  },
  '::placeholder': {
    color: GREY_MID,
    textOverflow: 'ellipsis',
  },
  ':focus': {
    outline: 'none',
    borderColor: GREY_MID,
  },
  '::-ms-clear': {
    width: 0,
    height: 0,
  },
}
export const inputRule = css(inputStyle)
export const Input = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements['input']
>((props, ref) => <input ref={ref} {...props} {...inputRule} />)
Input.displayName = 'Input'

export const submitStyle = {
  backgroundColor: LW_BLUE,
  color: WHITE,
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: LW_BLUE_HOVER,
  },
}
export const submitRule = merge(inputStyle, submitStyle)
export const Submit = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements['input']
>((props, ref) => <input ref={ref} type='submit' {...props} {...submitRule} />)
Submit.displayName = 'Submit'

export const clearStyle = {
  ':after': {
    content: '""',
    display: 'table',
    clear: 'both',
  },
}
export const clearRule = css(clearStyle)
export const Clear = React.forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} {...clearRule}>
    {children}
  </div>
))
Clear.displayName = 'Clear'
