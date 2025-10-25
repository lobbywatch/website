import React, { ReactNode } from 'react'
import { css } from 'glamor'

import { metaRule } from './Styled'
import { WHITE, GREY_DARK, GREY_LIGHT, BLACK } from '../theme'

const boxStyle = css({
  position: 'absolute',
  backgroundColor: WHITE,
  color: GREY_DARK,
  boxShadow: '0 2px 24px 0 rgba(0,0,0,0.25)',
  fontSize: 14,
  lineHeight: '1.1em',
  padding: '12px 16px',
  pointerEvents: 'none',
  zIndex: 10,
  minWidth: 200,
  borderRadius: 4,
})

const boxPosition = {
  top: {
    center: css({ transform: 'translateX(-50%) translateY(-100%)' }),
    left: css({ transform: 'translateX(-15%) translateY(-100%)' }),
    right: css({ transform: 'translateX(-85%) translateY(-100%)' }),
  },
  below: {
    center: css({ transform: 'translateX(-50%) translateY(0)' }),
    left: css({ transform: 'translateX(-15%) translateY(0)' }),
    right: css({ transform: 'translateX(-85%) translateY(0)' }),
  },
}

const notchStyle = css({
  position: 'absolute',
  width: 0,
  height: 0,
  borderStyle: 'solid',
  borderWidth: '8px 7.5px 0 7.5px',
  borderColor: `${WHITE} transparent transparent transparent`,
})

const notchPosition = {
  top: {
    center: css({ bottom: -8, transform: 'translateX(-50%)', left: '50%' }),
    left: css({ bottom: -8, transform: 'translateX(-50%)', left: '15%' }),
    right: css({ bottom: -8, transform: 'translateX(50%)', right: '15%' }),
  },
  below: {
    center: css({
      top: -8,
      transform: 'translateX(-50%) rotate(180deg)',
      left: '50%',
    }),
    left: css({
      top: -8,
      transform: 'translateX(-50%) rotate(180deg)',
      left: '15%',
    }),
    right: css({
      top: -8,
      transform: 'translateX(50%) rotate(180deg)',
      right: '15%',
    }),
  },
}

const labledValueStyle = css({
  fontSize: 14,
  lineHeight: '20px',
  borderBottom: `1px solid ${GREY_LIGHT}`,
  paddingBottom: 10,
  marginBottom: 5,
  color: BLACK,
  ':last-child': {
    borderBottom: 'none',
    paddingBottom: 5,
    marginBottom: 0,
  },
})

export interface ContextBoxValueProps {
  label: string
  children?: ReactNode
}

export const ContextBoxValue = ({ label, children }: ContextBoxValueProps) => {
  if (!children) {
    return null
  }
  return (
    <div {...labledValueStyle}>
      {!!label && (
        <span {...metaRule}>
          {label}
          <br />
        </span>
      )}
      {children}
    </div>
  )
}

export interface ContextBoxProps {
  label?: string
  x?: number
  y?: number
  contextWidth?: number
  children?: ReactNode
}

const ContextBox = ({
  x = 0,
  y = 0,
  contextWidth = 0,
  children,
}: ContextBoxProps) => {
  const maxWidth = Math.min(400, contextWidth)
  let xOrientation: 'left' | 'center' | 'right' = 'center'
  if (contextWidth - x < maxWidth / 2) {
    xOrientation = 'right'
  } else if (x < maxWidth / 2) {
    xOrientation = 'left'
  }

  return (
    <div
      {...boxStyle}
      className={boxPosition['below'][xOrientation].toString()}
      style={{ left: x, top: y, maxWidth }}
    >
      <div>{children}</div>
      <div
        {...notchStyle}
        className={notchPosition['below'][xOrientation].toString()}
      />
    </div>
  )
}

export default ContextBox
