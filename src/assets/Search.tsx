import React, { CSSProperties } from 'react'
import { GREY_MID } from '../theme'

export interface IconProps {
  size?: number
  style?: CSSProperties
  className?: string
  color?: string
}

const Icon = ({ size = 21, color = GREY_MID, style, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 21 21'
  >
    <g
      transform='translate(1 1)'
      stroke={color}
      strokeWidth='2'
      fill='none'
      fillRule='evenodd'
    >
      <circle cx='7.5' cy='7.5' r='7.5' />
      <path d='M14 14L18 18' strokeLinecap='square' />
    </g>
  </svg>
)

export default Icon
