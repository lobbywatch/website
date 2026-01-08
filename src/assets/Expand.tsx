import type { CSSProperties } from 'react'
import React from 'react'

export interface IconProps {
  size?: number
  style?: CSSProperties
  className?: string
  color?: string
  expanded?: boolean
}

const Icon = ({
  size = 24,
  style,
  className,
  color = 'var(--colorPrimary)',
  expanded = false,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 24 24'
  >
    <circle
      stroke={color}
      strokeWidth='1'
      fill={'var(--colorWhite)'}
      cx='12'
      cy='12'
      r='11'
    />
    {!expanded && <path fill={color} d='M11 6h2v12h-2z' />}
    <path fill={color} d='M6 11h12v2H6z' />
  </svg>
)

export default Icon
